import { useEffect, useState } from 'react';

export default function Commodity() {
  
  const [ commodities, setCommodities ] = useState([]);
  useEffect(() => {
    const fetchCommodities = async() => {
      try{
        const response = await fetch('http://localhost:5000/api/commodities', {
          method: 'GET',
          cache: 'no-store'
        });
        const data = await response.json();
        setCommodities(data);
      }catch(e){
        console.error('獲取商品資料失敗', e);
      }
    };
    fetchCommodities();
  }, []);
  //  console.log(commodities[0]._id);
  
  return (
    <div>
      <h1>這是商品頁面</h1>
      
      <ul style={{ display: 'flex', flexWrap: 'wrap' }}>
        {commodities.map((commodity) =>( 
          <div key={commodity._id} style={{ fontSize: '20px', margin: '10px', display:'inline-block', boxSizing: 'border-box'}} >
            
              <h3>{commodity.name}</h3>
              <p>{commodity.description}</p>
              <p>價格：{commodity.price}</p>
              <p>庫存：{commodity.number}</p>
              {commodity.image && (
                <img src={`${process.env.NEXT_PUBLIC_BASE_URL}${commodity.image.url}`} alt={commodity.name} width={200} />
                //要透過.env才能避免發送的get有http//:localhost:3000 
              )}
            
          </div>
        ))}
      </ul>
    </div>
  );
}