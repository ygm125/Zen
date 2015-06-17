fis.config.merge({
	project : { exclude : /^\/(node_modules|other)\/.*/i },
    roadmap : {
        path : [
        	{
                reg : /res\/(js|css|img)\/[^(other)].*/
            },
            {
                reg : /res\/(js|css|img)\/other\/.*/,
                useHash : false
            },
            {
                reg : "app/view/**"
            },
            {
                reg : /.*/,
                useCompile : false,
                useHash : false
            }
        ]
    }
});

fis.config.set('settings.preprocessor.combo', {
    baseUrl: "/res/js",
    paths: {

    }
});

fis.config.set('settings.postpackager.combo', {
    savePath: "/res/js/combo"
});

fis.config.set('modules.preprocessor', {
    html:'combo',
    js:'combo'
});

fis.config.set('modules.postpackager','combo');



