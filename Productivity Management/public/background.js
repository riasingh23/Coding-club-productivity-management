let STATE, clock, MODE;
let audio = new Audio("/assets/alarm.mp3");

let chromeTabOptions = {
    active: true,
    currentWindow: true
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({'startTime':0, 'duration':defaultSettings().ft*60, 'blockedUrls':[], 'taskList':[], 'settings':defaultSettings()});
    STATE = 0;
    MODE = 0;
});

chrome.runtime.onStartup.addListener(() => {
    MODE = 0;
    STATE = 0;
});


function addToBlocklist(url, callback){
    chrome.storage.local.get({'blockedUrls':[]}, (data)=>{
        for(let i = 0; i < data.blockedUrls.length; i++){
            if(url == data.blockedUrls[i]) return;
        }
        data.blockedUrls.push(url);
        chrome.storage.local.set(data, callback);
    });
}

function removemBlocklist(url, callback){
    chrome.storage.local.get({'blockedUrls':[]}, (data)=>{
        for(let i = 0; i < data.blockedUrls.length; i++){
            if(url == data.blockedUrls[i]){
                data.blockedUrls.splice(i, 1);
                break;
            }
        }
        chrome.storage.local.set(data, callback);
    });
}

function blpFindHosts(callback){
    chrome.storage.local.get({'blockedUrls':[]}, (data)=>{
        callback(data.blockedUrls);
    });
}

const cancelFunc = () => ({cancel: true});

function stopBlocking(){
    chrome.webRequest.onBeforeRequest.removeListener(cancelFunc);
}

function startBlocking(){
    blpFindHosts(all => {
        let blocklist = [];
        for(let i = 0; i < all.length; i++){
            blocklist.push(url2rgx(all[i]));
        }
        if(blocklist.length){
            chrome.webRequest.onBeforeRequest.addListener(
                cancelFunc,
                {urls: blocklist},
                ['blocking']
            );
        }
    });
}

function updateBlockListener(){
    if(STATE == 1 && MODE == 0){
        stopBlocking();
        startBlocking(); 
    } else{
        stopBlocking();
    }
}

function url2rgx(url) {
    return `*://*.${url}/*`
}