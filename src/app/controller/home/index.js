import base from "./base";

class index extends base{
	
	*index(param){
		yield* this.display('index/index');
	}
}

export default index;