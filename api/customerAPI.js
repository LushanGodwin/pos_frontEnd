export class CustomerAPI{

    getAllCustomer(){
        return new Promise((resolve,reject)=>{
            const http = new XMLHttpRequest();
            http.onreadystatechange = () => {
                if (http.readyState === 4) {
                    if (http.status === 200) {
                        resolve(http.responseText);
                    } else {
                        reject(new Error(`HTTP request failed with status ${http.status}`));
                    }
                }
            }
            http.open("GET", "http://localhost:8080/page/customer?action=getAllCustomer", true);
            http.send();
        });
    }

    getCustomer(customerId){
        return new Promise((resolve,reject)=>{
            const http = new XMLHttpRequest();
            http.onreadystatechange = () => {
                if (http.readyState === 4) {
                    if (http.status === 200) {
                        resolve(http.responseText);
                    } else {
                        reject(new Error(`HTTP request failed with status ${http.status}`));
                    }
                }
            }
            http.open("GET", "http://localhost:8080/page/customer?action=getCustomer&customerId="+customerId, true);
            http.send();
        });
    }

    updateCustomer(customer_obj) {
        return new Promise((resolve, reject)=>{
            const http = new XMLHttpRequest();
            http.onreadystatechange = () => {
                if (http.readyState === 4) {
                    if (http.status === 200) {
                        resolve(http.responseText);
                    } else {
                        reject(new Error(`HTTP request failed with status ${http.status}`));
                    }
                }
            }
            http.open("PUT", "http://localhost:8080/page/customer", true);
            http.setRequestHeader("Content-Type","application/json");
            http.send(JSON.stringify(customer_obj));
        });
    }

    deleteCustomer(customerIdValue) {
        return new Promise((resolve, reject) => {
            const http = new XMLHttpRequest();
            http.onreadystatechange = () => {
                if (http.readyState === 4) {
                    if (http.status === 200) {
                        resolve(http.responseText);
                    } else {
                        reject(new Error(`HTTP request failed with status ${http.status}`));
                    }
                }
            }
            http.open("DELETE", "http://localhost:8080/page/customer?customerIdValue="+customerIdValue, true);
            http.send();
        });
    }
}
