export class OrderAPI {

    generateOderID() {
        return new Promise((resolve, reject)=>{

            const http = new XMLHttpRequest();

            http.onreadystatechange = ()=>{
                if (http.readyState===4){
                    if(http.status===200){
                        resolve(http.responseText);
                    }else {
                        console.error('Error:', http.status, http.statusText);
                        reject(new Error(`HTTP request failed with status ${http.status}`));
                    }
                }
            }

            http.open("GET", "http://localhost:8080/page/Oder?action=generateOderID", true);
            http.send();
        });
    }

}