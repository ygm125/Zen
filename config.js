global.Config = {
    port : 8089,
    maxAge : APP_DEBUG ? 0 : 365 * 24 * 60 * 60,
    secret : 'Zen',
    watchFiles : APP_DEBUG ? 1000 : 0,
    viewCache : APP_DEBUG ? false : true,

    db : {
       
    },

    groups : ['home','admin'],
    defGroup : 'home',

    app : ROOT_PATH + '/app',
    model : ROOT_PATH + '/app/model',
    view : ROOT_PATH + '/app/view',
    controller : ROOT_PATH + '/app/controller',
    res : ROOT_PATH + '/res',
    favicon : ROOT_PATH + '/res/img/favicon.ico'
}

