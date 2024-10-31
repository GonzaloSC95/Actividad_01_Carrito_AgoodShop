export default class Producto
{
   constructor ( sku, nombre, precio, imagen, unidades, stock, moneda )
   {
      this.sku = sku;
      this.title = nombre;
      this.price = parseFloat( precio ).toFixed( 2 );
      this.image = imagen;
      this.units = unidades;
      this.stock = stock;
      this.currency = moneda;
   }
   /**AsTr */
   asTr ()
   {
      const row = document.createElement( 'tr' );
      row.id = this.sku;
      const nameCell = document.createElement( 'td' );
      nameCell.id = 'desc-producto';
      nameCell.innerHTML = `
         <h3 id='title-producto'>${ this.title }</h3>
         <img src="${ this.image }" alt="${ this.title }"></image>
         <p id='sku-producto'><b>REF</b>: ${ this.sku }</p>
         <p id='stock-producto'><b>Stock</b>: ${ this.stock }</p>
         `;

      const quantityCell = document.createElement( 'td' );
      quantityCell.innerHTML = `
            <div class="quantity-controls">
                <button id='restar-producto' class='red-button'>-</button>
                <input id='contador-producto' type="text" value="0" readonly>
                <button id='sumar-producto' class='green-button'>+</button>
            </div>
        `;

      const priceCell = document.createElement( 'td' );
      priceCell.id = "price-producto";
      priceCell.textContent = `${ this.price } ${ this.currency }`;

      const totalCell = document.createElement( 'td' );
      totalCell.id = 'contador-total-producto';
      totalCell.textContent = `0,00 ${ this.currency }`;

      row.appendChild( nameCell );
      row.appendChild( quantityCell );
      row.appendChild( priceCell );
      row.appendChild( totalCell );

      return row;
   }
   /**AsP*/
   asP ()
   {
      const p = document.createElement( 'p' );
      p.id = `p-${ this.sku }`;
      p.textContent = `${ this.units }x ${ this.title }: ${ this.GetPrecioTotal() }${ this.currency }`;
      return p;
   }
   /**ActualizarPrecio*/
   GetPrecioTotal ()
   {
      const total = parseFloat( this.price ) * this.units;
      return total.toFixed( 2 );
   }
}