/// <reference types="next" />

import 'next-auth'

declare module 'next-auth' {
  export interface Session {
    user: UserInterface
  }
  interface UserInterface {
    accessToken: string
    name: string
  }
}
