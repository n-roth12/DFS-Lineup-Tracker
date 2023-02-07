const prod_api_url = `http://ec2-18-144-168-136.us-west-1.compute.amazonaws.com`

// empty url will cause proxy route in package.json to be used
const dev_api_url = ``

const api_url = process.env.NODE_ENV === "development" ? dev_api_url : prod_api_url
export { api_url }