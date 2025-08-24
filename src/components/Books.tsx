// import axios from "axios"
// import { useEffect, useState } from "react"


// const Books = () => {
// const[data,setData]=useState([]);
//     const fetchData=async()=>{
      
//         try {
//               const resp= await axios.get("https://dummyjson.com/posts");
//               setData(resp.data.posts)
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     useEffect(()=>{
//         fetchData()
//     },[])
//   return (
//     <div>Books
//         <div>
//             {data.map((data,i)=>(
//                 <div>
//                     {data.title}
//                 </div>
//             ))}
//         </div>
//     </div>
//   )
// }

// export default Books