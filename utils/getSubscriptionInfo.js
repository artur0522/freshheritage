/*
  subscriptionGroup - from shopify product metafields
  frequencyName - from variant selected option // Ex: Monthly or Every Other Month. These frequency names should match interval names from subscription group
  membershipType - regular or prepaid
  duration - Ex. 1, 3, 6, 12
*/

export const getSubscriptionInfo = ({subscriptionGroup, frequencyName, membershipType, duration}) => {
  const { sub_group_id, billing_intervals, prepaid_options } = subscriptionGroup
  const billingInterval = billing_intervals.find(({interval_name}) => interval_name === frequencyName)
  const props = {
    sub_group_id: sub_group_id.toString(),
    interval_id: billingInterval.id.toString(),
    interval_text: billingInterval.interval_name,
  }
  if (membershipType === 'prepaid' && prepaid_options.find(option => option.duration === duration)) {
    props.prepaid_duration_id = prepaid_options.find(option => option.duration === duration).id.toString()
  }
  return props
}