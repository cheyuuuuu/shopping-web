const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Commodity = require('./models/commodity');
const { url } = require('inspector');
const app = express();

const saltRounds = 10;


mongoose
    .connect("mongodb://localhost:27017/member_db")
    .then(() => {
      console.log("成功連結mongoDB...");
    })
    .catch((e) => {
      console.log(e);
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors({
  origin: 'http://localhost:3000',  // 或使用環境變數來設置 URL
  credentials: true // 如果需要包含 cookie，啟用這個選項
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const upload = multer();

//登入
app.post('/api/login', async (req, res) =>{ 
  const { email, password } = req.body;
  try{
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({ message: '用戶不存在，請註冊新帳號' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
      return res.status(400).json({ message:'密碼錯誤' });
    }
    res.status(200).json({message:'登入成功', user: user });
  }catch(e){
    res.status(500).json({ message:'來自後端伺服器錯誤', e });
  }
});

//身分驗證
app.post('/api/auth[...nextauth]', async (req, res) =>{ 
  const { email, password } = req.body;
  try{
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({ message: '用戶不存在，請註冊新帳號' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
      return res.status(400).json({ message:'密碼錯誤' });
    }
    res.status(200).json({message:'登入成功', user: user });
  }catch(e){
    res.status(500).json({ message:'來自後端伺服器錯誤', e });
  }
});

//新增商品
app.post('/api/upload',upload.single('image'), async(req, res) => { 
  try{
    
    const {name , description, price, number,} = req.body;
    if (!req.file) {
      return res.status(400).json({ error: '請上傳圖片' });
    }
    const imagePath = path.join(__dirname, 'public/images', req.file.originalname);
    fs.writeFileSync(imagePath, req.file.buffer);

    const newCommodity = new Commodity({
      name,
      description,
      price,
      number,
      image: {
              contentType: req.file.mimetype,
              url: `/images/${req.file.originalname}`,
      },
    });
    console.log(imagePath);
    await newCommodity.save();
    res.status(200).json({message:'商品上傳成功' , data: newCommodity});
  }catch(error){
    res.status(500).json({error:'商品上傳失敗', error: error.message});
  }
});

//修改商品
app.patch('/api/edit', async (req, res) =>{
  try{
    const { updates } = req.body;
    // 批量更新每個商品
    const updatePromises = Object.keys(updates).map(id => 
      Commodity.findByIdAndUpdate(id, updates[id], { new: true })
    );
    const updatedCommodities = await Promise.all(updatePromises);
    res.status(200).json({ message:'修改成功', updatedCommodities});
  }catch(e){
    res.status(500).json({ message: '修改失敗', error: e.message});
  }
})

//刪除商品&後端資料夾中的圖片
app.delete('/api/delete', async(req, res ) =>{
  try{
    const { deletes } = req.body;
    const deletePromises = deletes.map(id => 
      Commodity.findByIdAndDelete(id)
    );
  const deleteCommodities = await Promise.all(deletePromises);
  deleteCommodities.forEach(commodity => {
    const imageUrl = commodity?.image?.url;
    console.log(imageUrl);
    if (imageUrl) {
      const imagePath = path.join(__dirname, 'public', imageUrl);

      // 刪除圖片
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`圖片已刪除: ${imagePath}`);
      } else {
        console.warn(`找不到圖片: ${imagePath}`);
      }
    }
  });
  res.status(200).json({message:'刪除成功', deleteCommodities});
  }catch(e){
    res.status(500).json({ message:'刪除失敗',e})
  }
})

app.get('/api/commodities', async (req, res) => {
  try{
    res.set('Cache-Control', 'no-store');
    const commodities = await Commodity.find({});
    res.status(200).json(commodities);
  }catch(e){
    res.status(500).json({ message: '資料取得失敗' , error: error.message });
  }
})

// 會員註冊
app.post('/api/register', async (req, res) => { 
  // console.log(req.body);
  const { name, email, password } = req.body;
  let role = req.body.role || 'user';
  try {
    const existingUser = await User.findOne({ email });
    if(existingUser){
      return res.status(400).json({ message: '該信箱已被註冊'});
    }
    if(name ==='admin'){ //設定管理員
      role = 'admin';
    };
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();  // 將資料儲存到 MongoDB
    console.log("資料儲存成功");
    res.status(201).json({ message: '使用者資料成功存入資料庫', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
