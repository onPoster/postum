const axios = require('axios').default

const APIURL = "http://localhost:8000/subgraphs/name/EzraWeller/postum"

async function querySubgraph(query) {
  let res
  try {
    res = (await axios.post(APIURL, { query })).data
  } catch (err) {
    console.error('Graph query error: ', err)
  }
  return res
}

async function queryForums() {
  const query = `{
    forums {
      id
      title
      admin_roles {
        id
        user {
          id
        }
      }
    }
  }`
  return (await querySubgraph(query)).data.forums
}

async function main() {
  const forums = await queryForums()
  console.log(forums, forums[0].admin_roles)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })