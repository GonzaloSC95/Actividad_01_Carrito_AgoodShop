//Modulos
import { Get, Put, Post } from './api.js';
import Carrito from './Carrito.js';
import Producto from "./producto.js";

window.addEventListener( 'DOMContentLoaded', async () =>
{
   //Inicializamos el carrito
   const carrito = new Carrito( [] );
   //Inicializamos la tabla de productos
   const productsTable = document.getElementById( 'productsTable' )
      .querySelector( 'tbody' );
   const cajaCarrito = document.getElementById( 'caja-carrito' );
   const carritoTotal = document.getElementById( "carrito-total" );
   const productos = [];
   const Api = await Get();

   //Rellenamos la tabla de productos
   Api.products.forEach( producto =>
   {
      productos.push( new Producto( producto.SKU, producto.title, producto.price, producto.image, 0, producto.stock, Api.currency ) );
   } );
   productos.forEach( producto => productsTable.appendChild( producto.asTr() ) );
   //Actualizamos el carrito total
   carrito.getCarrito().forEach( producto => cajaCarrito.appendChild( producto.asP() ) );
   const total = carrito.getTotal();
   carritoTotal.textContent = `${ total.toFixed( 2 ) }${ Api.currency }`;


   //Eventos
   //Restar producto
   const restarProducto = document.querySelectorAll( '#restar-producto' );
   restarProducto.forEach( boton => boton.addEventListener( 'click', e =>
   {
      const sku = e.target.parentElement.parentElement.parentElement.id;
      const producto = carrito.getProducto( sku );
      const contador = e.target.parentElement.querySelector( '#contador-producto' );
      if ( ( producto ) && ( producto.units > 0 ) )
      {
         contador.value = carrito.setUnidades( producto, -1 );
         e.target.parentElement.parentElement.parentElement.querySelector( '#contador-total-producto' ).textContent = `${ producto.GetPrecioTotal() }${ producto.currency }`;
         e.target.parentElement.parentElement.parentElement.querySelector( '#stock-producto' ).innerHTML = `<b>Stock</b>: ${ producto.stock }`;
         //Actualizamos el carrito total
         carritoTotal.textContent = `${ carrito.getTotal().toFixed( 2 ) }${ Api.currency }`;
      }
      else if ( ( producto ) && ( producto.units == 0 ) )
      {
         producto.delProducto();
         //Actualizamos el carrito total
         carritoTotal.textContent = `${ carrito.getTotal().toFixed( 2 ) }${ Api.currency }`;
      }
   } ) );

   //Sumar producto
   const sumarProducto = document.querySelectorAll( '#sumar-producto' );
   sumarProducto.forEach( boton => boton.addEventListener( 'click', e =>
   {
      let sku = e.target.parentElement.parentElement.parentElement.id;
      let producto = carrito.getProducto( sku );
      let contador = e.target.parentElement.querySelector( '#contador-producto' );
      if ( ( producto ) && ( producto.stock > 0 ) )
      {
         contador.value = carrito.setUnidades( producto, 1 );
         e.target.parentElement.parentElement.parentElement.querySelector( '#contador-total-producto' ).textContent = `${ producto.GetPrecioTotal() }${ producto.currency }`;
         e.target.parentElement.parentElement.parentElement.querySelector( '#stock-producto' ).innerHTML = `<b>Stock</b>: ${ producto.stock }`;
         //Actualizamos el carrito total
         carritoTotal.textContent = `${ carrito.getTotal().toFixed( 2 ) }${ Api.currency }`;
      }
      else if ( ( ( producto ) && ( producto.stock === 0 ) ) || ( e.target.parentElement.parentElement.parentElement.querySelector( '#stock-producto' ).textContent.split( ':' )[ 1 ].trim() === '0' ) )
      {
         alert( 'No hay stock' );
         return false;
      }
      else
      {
         let productoFromApi = Api.products.find( producto => producto.SKU === sku );
         let producto = new Producto( productoFromApi.SKU, productoFromApi.title, productoFromApi.price, productoFromApi.image, 0, productoFromApi.stock, Api.currency );
         carrito.setProducto( producto );
         contador.value = carrito.setUnidades( producto, 1 );;
         e.target.parentElement.parentElement.parentElement.querySelector( '#contador-total-producto' ).textContent = `${ producto.GetPrecioTotal() }${ producto.currency }`;
         e.target.parentElement.parentElement.parentElement.querySelector( '#stock-producto' ).innerHTML = `<b>Stock</b>: ${ producto.stock }`;
         //Actualizamos el carrito total
         carritoTotal.textContent = `${ carrito.getTotal().toFixed( 2 ) }${ Api.currency }`;
      }
   } ) );

   //Agregar productos
   const contador_total_productos = document.querySelectorAll( '#contador-total-producto' );
   const observer = new MutationObserver( ( mutationsList, observer ) =>
   {
      for ( let mutation of mutationsList )
      {
         if ( mutation.type === 'childList' || mutation.type === 'characterData' )
         {
            const sku = mutation.target.parentElement.id;
            const producto = carrito.getProducto( sku );
            if ( producto )
            {
               if ( producto.units === 0 )
               {
                  carrito.delProducto( sku );
                  cajaCarrito.removeChild( document.getElementById( `p-${ sku }` ) );
               }
               else
               {
                  if ( document.getElementById( `p-${ sku }` ) )
                  {
                     cajaCarrito.removeChild( document.getElementById( `p-${ sku }` ) );
                  }
                  cajaCarrito.appendChild( producto.asP() );
               }
            }
         }
      }
   } );
   contador_total_productos.forEach( contador_total_producto => ( observer.observe( contador_total_producto, { childList: true, characterData: true, subtree: true } ) ) );

   //Realizar compra
   const botonRealizarCompra = document.getElementById( 'carrito-botonera-si' );
   botonRealizarCompra.addEventListener( 'click', async () =>
   {
      //Comprobamos si hay productos en el carrito
      if ( carrito.getCarrito().length === 0 )
      {
         alert( 'No hay productos en el carrito' );
         return false;
      }
      //Actualizamos el stock de los productos en la API
      Api.products.forEach( producto => carrito.getCarrito().forEach( productoCarrito => { if ( producto.SKU === productoCarrito.sku ) { producto.stock = productoCarrito.stock; } } ) );
      //Componemos el body de la solicitud
      const compra = {
         currency: Api.currency,
         products: Api.products,
      };
      //Realizamos la solicitud de compra a la API
      const respuesta = await Put( compra );
      if ( respuesta )
      {
         alert( 'Compra realizada correctamente' );
         carrito.ClearCarrito();
         window.location.reload();
      }
   } );

   //Cancelar compra
   const botonCancelarCompra = document.getElementById( 'carrito-botonera-no' );
   botonCancelarCompra.addEventListener( 'click', () =>
   {
      //Comprobamos si hay productos en el carrito
      if ( carrito.getCarrito().length === 0 )
      {
         alert( 'No hay productos en el carrito' );
         return false;
      }
      carrito.ClearCarrito();
      window.location.reload();
   } );

} );