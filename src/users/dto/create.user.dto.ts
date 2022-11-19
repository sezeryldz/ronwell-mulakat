export interface CreateUserDto {
  id: number
  firstName?: string
  lastName?: string
  email: string
  password: string
  phone?: string
  type: string
  updatedAt?: string
  createdAt?: string
  companyName?: string
  accessToken?: string
  hostCompany?: number
}
