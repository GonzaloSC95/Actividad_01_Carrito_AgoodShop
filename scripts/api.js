//Constantes
//url: https://jsonblob.com/1294633783511605248"
const apiUrl = "https://jsonblob.com/api/jsonBlob";
const blob = "/1294633783511605248";

//Funciones
/** GET /api/jsonBlob/<blobId> */
export async function Get ()
{
   try
   {
      const respuesta = await fetch( apiUrl + blob );

      if ( !respuesta.ok )
      {
         throw new Error( 'Error en la solicitud' );
      }
      return await respuesta.json();
   } catch ( error )
   {
      console.error( 'Error:', error );
      return false;
   }
}

/** POST /api/jsonBlob */
export async function Post ( datos )
{
   try
   {
      const respuesta = await fetch( apiUrl, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
         },
         body: JSON.stringify( datos )
      } );

      if ( !respuesta.ok )
      {
         throw new Error( 'Error en la solicitud' );
      }
      return await respuesta.json();
   } catch ( error )
   {
      console.error( 'Error:', error );
      return false;
   }
}

/** PUT /api/jsonBlob/<blobId> */
export async function Put ( datos )
{
   try
   {
      const respuesta = await fetch( apiUrl + blob, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
         },
         body: JSON.stringify( datos )
      } );

      if ( !respuesta.ok )
      {
         throw new Error( 'Error en la solicitud' );
      }
      return await respuesta.json();
   } catch ( error )
   {
      console.error( 'Error:', error );
      return false;
   }
}

/** DELETE /api/jsonBlob/<blobId> */
export async function Delete ()
{
   try
   {
      const respuesta = await fetch( apiUrl, {
         method: 'DELETE'
      } );

      if ( !respuesta.ok )
      {
         throw new Error( 'Error en la solicitud' );
      }
   } catch ( error )
   {
      console.error( 'Error:', error );
      return false;
   }
}