
import * as FileSystem from "expo-file-system";
import { firebase } from "./Config";





 const uploadMedia = async (selectedimage) => {
    
    
   

  

    try {
      const { uri } = await FileSystem.getInfoAsync(selectedimage);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = (e) => reject(new Error("Network request failed"));

        xhr.responseType = "blob";
        xhr.open("get", uri, true);
        xhr.send(null);
      });

      const filename = selectedimage.substring(selectedimage.lastIndexOf("/") + 1);
      const ref = firebase.storage().ref().child(filename);
      await ref.put(blob);
      const downloadURL = await ref.getDownloadURL();
      
     return downloadURL;
    
    } catch (error) {
     
      return false;
    }
  };
  export default uploadMedia;