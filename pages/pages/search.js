import {
  Highlight,
  Hits,
  Index,
  InstantSearch,
  SearchBox,
  RefinementList
} from 'react-instantsearch-hooks-web';
import { history } from 'instantsearch.js/es/lib/routers';
import { simple } from 'instantsearch.js/es/lib/stateMappings';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch('9RTKNI42PN', '4876c2b9c59451c3b189e5bd892dfc9f')

function Hit({ hit }) {
    return (
      <article>
        <Highlight attribute="title" hit={hit} />
      </article>
    );
}

const routing = {
    router: history(),
    stateMapping: simple(),
};

function Search() {
  return (
    <InstantSearch 
        searchClient={searchClient} 
        indexName="sandbox_culinary" 
        routing={routing}
    >

      <SearchBox />

      <RefinementList attribute="title" />

      <Index indexName="sandbox_culinary">
        <Hits hitComponent={Hit} />
      </Index>

      <Index indexName="sandbox_brand">
        <Hits hitComponent={Hit} />
      </Index>

      <Index indexName="prod_shopify_products">
        <Hits hitComponent={Hit} />
      </Index>
    </InstantSearch>
  );
}

export default Search