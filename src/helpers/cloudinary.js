import axios from "axios";

const APP = "frms";
const URL = `https://api.cloudinary.com/v1_1/${APP}/image/upload`;

export const uploadImage = img => {
  axios
    .post(URL, {
      file: img,
      upload_preset: "roxhq0sn"
    })
    .then(result => console.log(result));
};
