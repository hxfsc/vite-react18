import { Outlet } from "react-router-dom"
export default () => {
  return (
    <div>
      Test2 child

      <div>
        =====
        <Outlet/>
      </div>
    </div>
  )
}
