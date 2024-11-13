import { useEffect, useState } from 'react';


export default function Edit(){
  const [ commodities, setCommodities ] = useState([]);
  const [ updates, setUpdates ] = useState({});
  useEffect(() => {
    const fetchCommodities = async() => {
      try{
        const response = await fetch('http://localhost:5000/api/commodities', {
          method: 'GET',
          cache: 'no-store'
        });
        const data = await response.json();
        setCommodities(data);
        // 初始化更新的資料結構
        const initialUpdates = data.reduce((acc, item) => {
          acc[item._id] = { price: item.price, number: item.number, isSelected: false };
          return acc;
        }, {});
        setUpdates(initialUpdates);
      }catch(e){
        console.error('獲取商品資料失敗', e);
      }
    };
    fetchCommodities();
  }, []);
  
  const handleInputChange = (id, field, value) => {
    setUpdates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleCheckBoxCahnge = (id) => {
    setUpdates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isSelected: !prev[id].isSelected //切換選取狀態
      }
    }));
  };

  const handleDelete = async () =>{
    const selectedDelete = Object.keys(updates)
      .filter((id) => updates[id].isSelected);
   
    if(selectedDelete.length === 0 ){
        alert('請先勾選需要刪除的商品');
        return;
    }
  
    try{
        const response = await fetch('http://localhost:5000/api/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deletes: selectedDelete })
        });
        const result = await response.json();
        if(response.ok){
          console.log('刪除成功', result);
          alert('刪除成功');
          setCommodities(prev => prev.filter(item => !selectedDelete.includes(item._id)));
        }else{
          console.error('刪除失敗', result.message);
        }
    }catch(e){
      console.error('刪除商品失敗', e );
    };
  }

  const handleUpdate = async () => {
    const selectedUpdates = Object.keys(updates)
      .filter((id) => updates[id].isSelected)
      .reduce((acc, id) =>{
        acc[id] = { price: updates[id].price, number: updates[id].number};
        return acc;
      },{});

    if(Object.keys(selectedUpdates).length === 0 ){
        alert('請先勾選需要修改的商品');
        return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/edit', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: selectedUpdates })
      });
      const result = await response.json();
      if (response.ok) {
        console.log('更新成功', result);
        alert('修改成功！');
      } else {
        console.error('更新失敗', result.message);
      }
    } catch (e) {
      console.error('更新商品資料失敗', e);
    }
  };

  return(
    <div>
      <h3 style={{padding:10,}}>商品總覽</h3>
      <table>
      <thead>
        <tr style={{padding:10,}}>
          <th style={{padding:10,}}>商品名稱</th>
          <th style={{padding:10,}}>商品描述</th>
          <th style={{padding:10,}}>商品價格</th>
          <th style={{padding:10,}}>商品庫存</th>
        </tr>
      </thead>
      <tbody>
        {commodities.map((commodity) =>(
          <tr key={commodity._id}>
            <input 
            type='checkbox'
            checked = {updates[commodity._id].isSelected || false}
            onChange = {() => handleCheckBoxCahnge(commodity._id)}>
            </input>
            <td style={{padding:10,}}>{commodity.name}</td>
            <td style={{padding:10,}}>{commodity.description}</td>
            <td style={{padding:10,}}>
              <input
                  type="number"
                  value={updates[commodity._id]?.price || ''}
                  onChange={(e) => handleInputChange(commodity._id, 'price', e.target.value)}
                  disabled={!updates[commodity._id]?.isSelected}/>
            </td>
            <td style={{padding:10,}}>
              <input
                  type="number"
                  value={updates[commodity._id]?.number || ''}
                  onChange={(e) => handleInputChange(commodity._id, 'number', e.target.value)}
                  disabled={!updates[commodity._id]?.isSelected}/>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <button onClick={handleUpdate}>修改</button>
      <button onClick={handleDelete}>刪除</button>
    </div>
  );
}