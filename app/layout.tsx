
import "./globals.css";

import React, { PropsWithChildren } from 'react'

 const RootLayout = (props:PropsWithChildren) => {
  return (
   <html lang="en">

    <body>
      {props.children}
    </body>
   </html>
  )
}
export default RootLayout;