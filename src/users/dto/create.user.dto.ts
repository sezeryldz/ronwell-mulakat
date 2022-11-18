export interface CreateUserDto {
  id: string
  firstName?: string
  lastName?: string
  email: string
  password: string
  type: string
  UpdatedAt?: number
  CreatedAt: number
}
