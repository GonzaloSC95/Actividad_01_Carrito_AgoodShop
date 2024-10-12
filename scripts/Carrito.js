export default class Carrito
{
   constructor ( productos )
   {
      this.productos = productos;
   }
   /**Carrito actual*/
   getCarrito ()
   {
      return this.productos;
   }
   /**Obtener información de un producto*/
   getProducto ( sku )
   {
      // Busca el producto en el array de productos por su SKU
      const producto = this.productos.find( producto => producto.sku === sku );
      return producto;
   }
   /**Añadir producto al carrito*/
   setProducto ( producto )
   {
      this.productos.push( producto );
   }
   /**Sacar producto de la cesta */
   delProducto ( sku )
   {
      // Busca el índice del producto en el array de productos por su SKU
      const index = this.productos.findIndex( producto => producto.sku === sku );
      if ( index > -1 )
      {
         this.productos.splice( index, 1 );
      }
   }
   /**Añadir unidades del producto al carrito*/
   setUnidades ( producto, unidades )
   {
      if ( producto )
      {
         producto.units += unidades;
         producto.stock -= unidades;
         return producto.units;
      }
      else
      {
         console.error( `No se ha encontrado el producto` );
         return null;
      }
   }
   /**Obtener el precio total del carrito*/
   getTotal ()
   {
      return this.productos.reduce( ( sum, producto ) => parseFloat( sum ) + parseFloat( producto.GetPrecioTotal() ), 0 );
   }
   /**Vaciar carrito*/
   ClearCarrito ()
   {
      this.productos = [];
   }
}