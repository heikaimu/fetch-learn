import { get } from "./http.js";


const URL = 'https://shopify-guest-manage.obs.cn-southwest-2.myhuaweicloud.com/2021-12-01/26369e15-7818-410d-b03a-1ef0117db807.png';
get(URL, 20000).then(blob => {
  console.log(blob);
}).catch(err => {
  console.log(err);
});