/*global axios*/
/*global Vue*/
var app = new Vue({
  el: '#admin',
  data: {
    items: [],
    name: "",
    file: null,
    addItem: null,
    addPrice: "",
    findTitle: "",
    findDesc: "",
    findItem: null,
  },
  created() {
    this.getItems();
  },
  computed: {
    suggestions() {
      return this.items.filter(item => item.name.toLowerCase().startsWith(this.findTitle.toLowerCase()));
    }
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        console.log("no get");
        console.log(error);
      }
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('api/photos', formData);
        let r2 = await axios.post('api/items', {
          name: this.name,
          path: r1.data.path,
          price: this.addPrice,
          buys: 0,
          buyNow: false,
        });
        this.addItem = r2.data;
        console.log("upload");
      } catch (error) {
        console.log("no upload");
        console.log(error);
      }
    },
    selectItem(item) {
      console.log("select");
      this.findTitle = "";
      this.findItem = item;
      this.findDesc = item.description;
    },
    async deleteItem(item) {
      console.log("delete");
      try {
        let response = axios.delete("/api/items/"+ item._id);
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log("no delete");
        console.log(error);
      }
    },
  },
  
});
