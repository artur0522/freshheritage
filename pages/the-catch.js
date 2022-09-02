
import LoadingState from "@/components/LoadingState"

const TheCatchIndex = () => {
  return <LoadingState />
}

export async function getStaticProps() {

  const month = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
  const date = new Date()
  const monthName = month[date.getMonth()]
  const year = date.getFullYear()

  let theCatchUrl = `/the-catch/premium-seafood-box-${monthName}-${year}`

  return {
    redirect: {
      destination: theCatchUrl,
    },
  }
}

export default TheCatchIndex