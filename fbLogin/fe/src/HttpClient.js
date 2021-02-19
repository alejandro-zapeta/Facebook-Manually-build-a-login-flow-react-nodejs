//const URL_BACKEND = "http://localhost:1111/rs/";

class HttpClient {
    static get(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest;

            xhr.open("GET", url);
            //xhr.withCredentials = true;

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(xhr.statusText);
                }
            };
            xhr.onerror = () => reject(xhr.statusText);

            xhr.send(null);
        });
    }
    static post(url, data, extraHeaders = []) {
        //console.log("0first post " + url);
        return new Promise((resolve, reject) => {
            //console.log("first post " + url);
            let xhr = new XMLHttpRequest;
            // xhr.open("POST", URL_BACKEND + url);
            xhr.open("POST", url);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            for (var i = extraHeaders.length - 1; i >= 0; i--) {
                xhr.setRequestHeader(extraHeaders[i]["key"], extraHeaders[i]["val"]);
            }
            //  if (typeof(headers) !== "undefined") {
            //      xhr.setRequestHeader("Content-Type", headers);
            /*
            for (var i = headers.length - 1; i >= 0; i--) {
                let header0 = headers[i];

            }*/
            //}
            //.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            // xhr.withCredentials = true;
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject({ "code": xhr.status, "errormsg": xhr.statusText });
                }
            };
            xhr.onerror = () => reject({ "code": -1, "errormsg": xhr.statusText });
            //xhr.setRequestHeader("Content-Type", "text/html");
            //xhr.setRequestHeader("Accept", "text/html");
            //console.log("before posting");
            xhr.send(JSON.stringify({ "dt": data }));
        });
    }
    static postForm(url, data, extraHeaders) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest;
            xhr.open("POST", url);
            for (var i = extraHeaders.length - 1; i >= 0; i--) {
                xhr.setRequestHeader(extraHeaders[i]["key"], extraHeaders[i]["val"]);
            }
            // xhr.withCredentials = true;
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(xhr.statusText);
                }
            };
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send(data);
        });
    }
}
export default HttpClient;