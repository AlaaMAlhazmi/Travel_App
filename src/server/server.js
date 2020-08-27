const app = require('./routes.js')

const port = process.env.PORT || 3000;

//start server
app.listen(port, ()=>{
	console.log('server started on port 3000');
})