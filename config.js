global.Config = {
    port : 8380,
    maxAge : APP_DEBUG ? 0 : 365 * 24 * 60 * 60,

    db : {
       
    },

    groups : ['home','admin'],
    defGroup : 'home',

    model : ROOT_PATH + '/app/model',
    view : ROOT_PATH + '/app/view',
    controller : ROOT_PATH + '/app/controller',
    res : ROOT_PATH + '/res';
}

