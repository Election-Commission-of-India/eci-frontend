import apiClient from "./apis";

  const fetchPollingStation  =  async () =>  {
      const  resp = await apiClient.get("/locations/polling-stations");

    return resp.data;




  }
   const fetchAssemblyStation =  async () => {
    
   const resp = await  apiClient.get("/locations/assemblies") ;  

   return resp.data;

   }

 
export const locationApis = {
    fetchAssemblyStation,
    fetchPollingStation
  

};
