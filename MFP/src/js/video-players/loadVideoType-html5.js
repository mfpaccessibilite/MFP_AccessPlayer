

MFP.prototype.loadVideoHtml5 = function(){
    const video = $(this.element)[0];
    const videoProxy = new Proxy(video, {
        get(target, propKey, receiver) {
            if(propKey=='on'){
                return this.on.bind(target);
            }
            if(propKey=='off'){
                return this.off.bind(target);
            }
            if(target[propKey].bind!==undefined){
                return target[propKey].bind(target);
            }
            return target[propKey];
        },
        set(target, propKey, value, receiver) {
            target[propKey] = value;
            return true;
        },
        on(event, callback){
          return $(video).on(event, callback);
        },
        off(event, callback=null){
          return $(video).off(event, callback);
        }
    });
    return videoProxy;
};
