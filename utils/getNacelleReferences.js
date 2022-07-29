import { nacelleClient } from 'services'
import traverse from 'traverse'
import { uniq } from 'lodash-es';

export const getNacelleReferences = async (page) => {
  // traverse the dom and look for nacelle references
  const nacelleEntryIds = traverse(page).reduce((carry, x) => {
    if (x && typeof x === 'object' && x.type === 'NacelleReference') {
      carry.push(x)
    }
    return carry
  }, []).map(ref => {
    return ref.nacelleEntryId
  }).map(item => item)

  if (!nacelleEntryIds || nacelleEntryIds.length <= 0) {
    return page
  }

  // remove duplicate entry ids
  const uniqNacelleEntryIds = uniq(nacelleEntryIds)

  // split entry ids into batches of 50
  const size = 50; const batches = [];
  for (var i=0; i<uniqNacelleEntryIds.length; i+=size) {
    batches.push(uniqNacelleEntryIds.slice(i,i+size));
  }

  // make more queries to get missing reference data
  let allReferences = await batches.reduce(async (carry, batch) => {
    let promises = await carry;
    const entries = await nacelleClient.content({
      nacelleEntryIds: batch
    })
    if (entries) {
      return [...promises, ...entries]
    }
  }, Promise.resolve([]))

  // convert reference array into object to find references faster
  const objectReferences = allReferences.reduce((carry, ref) => {
    carry[ref.nacelleEntryId] = ref
    return carry
  }, {})

  // traverse the initial page content again
  // and update all nacelle references
  traverse(page).forEach(function(x) {
    const _this = this
    if (x && typeof x === 'object' && x.type === 'NacelleReference') {
      const reference = objectReferences[x.nacelleEntryId]
      _this.update(reference.fields)
    }
  })

  return page
}