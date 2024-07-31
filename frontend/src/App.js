import React from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
      fetch('http://localhost:3000/api/products')
          .then(response => response.json())
          .then(data => setProducts(data))
          .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
      <div className="App">
          <h1>Product Listings</h1>
          <ul>
              {products.map(product => (
                  <li key={product._id}>
                      <h2>{product.name}</h2>
                      <p>{product.description}</p>
                      <p>${product.price}</p>
                  </li>
              ))}
          </ul>
      </div>
  );
}

export default App;
