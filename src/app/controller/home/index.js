import base from "./base";

class index extends base{
	
	*index(param){

		this.assign( 'mockdata', function( next ) {
            setTimeout(function(){
            	next(null,'zen');
            },500);
        } );

		yield* this.display('index/index');
	}
}

export default index;