/**
 * class framework REST methods
 */
class Framework{

    public requestPost(url: string,listener:PostResponseListener,data:string)
    {
        let xml = new XMLHttpRequest();
        xml.onreadystatechange = function ServerResponse() {
            
            if(xml.readyState==4){
                listener.handlerPostResponse(xml.status, xml.response);      
                
            }

        }
        
        xml.open("POST",url,true);
        xml.setRequestHeader("Content-Type", "application/Json;charset=UTF-8");
        xml.send(data);
    }
}