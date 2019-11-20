/*global axios*/
/*global Vue*/
var app = new Vue({
  el: '#app',
    data: {
    items: [],
    voted: '',
    selected: [],
    purchased: [],
    submitted: null,
  },
   created() {
    this.getItems();
  },
    methods: {
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async addItem(item) {
      if(item.buyNow===true){
        item.buyNow = false;
      }else{
        item.buyNow = true;
      }
      try {
        var v = item.buys;
        let response = await axios.put("/api/items/" + item._id, {
          buys: v,
          buyNow: item.buyNow,
        });
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async purchase() {
      this.submitted = true;
      this.getItems();
      for(let i=0; i<this.items.length; i++){
        if(this.items[i].buyNow==true){
          let temp = this.items[i];
          this.selected.push(temp);
        }
      }
      for(let i=0; i<this.selected.length; i++){
        let item = this.selected[i];
      try {
        var v = item.buys + 1;
        let response = await axios.put("/api/items/" + item._id, {
          buys: v,
          buyNow: false,
        });
        //this.selected[i] = null;
        this.getItems();
      } catch (error) {
        console.log(error);
      }
      }
      
    },
  },
  /*computed: {
    submitted: function(){
      
    },
  },*/
});