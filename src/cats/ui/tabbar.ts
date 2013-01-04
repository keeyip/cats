
module cats.ui {



export class AspectWidget {

    private aspects = {};
    defaultHandler = (data,name:string) => { return data[name];};

   
    setAspect(name,aspect) {
        this.aspects[name] = aspect;
    }

    getValue(data,name:string)  {
		var fn = this.aspects[name] || this.defaultHandler;
		return fn(data,name);
	}

}

export class Tabbar extends AspectWidget {

    private root : HTMLElement;
    private ul: HTMLElement;
    private select: HTMLElement;

    onselect:(option)=> void;
    options = [];

    constructor() {
        super();
        this.root = <HTMLElement>document.createElement("div");
        this.ul = <HTMLElement>document.createElement("ul");
        this.select = <HTMLElement>document.createElement("select");
        this.ul.onclick = this.onClickHandler.bind(this);
        this.select.onchange = (ev) => this.onChangeHandler(ev);
        this.select.style.display = "none";
        this.root.appendChild(this.ul);
        this.root.appendChild(this.select);
        this.root.className = "tabbar";
        this.ul.className = "tabbar";

    }


    private renderDropDown() {
        this.select.style.display = "block";
        this.select.innerHTML = "";
        this.options.forEach( (option) => {
            var optionElem = <HTMLOptionElement>document.createElement("option");
            optionElem.innerText = this.getValue(option,"name");
            var selected = this.getValue(option,"selected");
            if (selected === true) {
                optionElem.selected = true;
                // optionElem.setAttribute("selected","selected");
             }
            optionElem["_value"] = option;
            this.select.appendChild(optionElem);
        });

    }

    private render() {
        this.ul.innerHTML="";
        this.options.forEach( (option) => {
             var optionElem = document.createElement("li");
             optionElem["_value"] = option;
             optionElem.innerText = this.getValue(option,"name");

             var longName = this.getValue(option,"longname");
             if (longName) optionElem.setAttribute("title",longName);

             var selected = this.getValue(option,"selected");
             if (selected === true) {
                optionElem.className = "active";
             }                     
            
             var changed = this.getValue(option,"changed");
             if (changed === true) {
                optionElem.className += " changed";
             }

             /*
             var closeButton = document.createElement("span");
             closeButton.innerHTML = "X";
             optionElem.appendChild(closeButton);

            */
             this.ul.appendChild(optionElem);
        });
        // console.log("Overflow: " + this.isOverflowed());
        if (this.isOverflowed()) { 
            this.renderDropDown();
        } else {
            this.select.style.display = "none";
        }
    }

    refresh() {
        this.render();
    }

    private isOverflowed():bool{
        var element = this.ul;
        return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    }


    setOptions(arr:any[]) {
        this.options = arr;
    }

    appendTo(elem:HTMLElement) {
        this.render();
        elem.appendChild(this.root);
    }

/*
    select(obj,notify=false) { 
        
        this.options.forEach(option => {
                if (option.value === this.selected) { 
                        option.elem.className = "active";
                 } else {                       
                        option.elem.className = "";
                }
        });           
    }
*/

    private getSelectedOption(ev) {
        var elem = ev.srcElement;
        return elem["_value"];
    }

    private onClickHandler(ev) {
        if (this.onselect) {            
            var option = this.getSelectedOption(ev);
            this.onselect(option);
        }
    }

    private onChangeHandler(ev) {
        if (this.onselect) {
             var sel = ev.srcElement;
             var option = sel.options[sel.selectedIndex];
             var value = option["_value"];
             this.onselect(value);
        }            
    }
   
}



}