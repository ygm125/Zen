import Base from "./base";

class Index extends Base{
	
	*index(param){
		
		this.assign( 'mockdata', function( next ) {
            setTimeout(function(){
            	next(null,'zen');
            },500);
        } );

		yield* this.display('index/index');
	}
}

export default Index;