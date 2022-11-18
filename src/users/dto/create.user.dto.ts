export interface CreateUserDto {
  id: number
  firstName?: string
  lastName?: string
  email: string
  password: string
  type: string
  UpdatedAt?: number
  CreatedAt: number
  companyName?: string
}
