"use client"
import { redirect } from "next/navigation"
import { toast } from "sonner"
import { useEffect } from "react"
const NotFound = () => {
  useEffect(() => {
    toast.warning("Where are you going?")
    redirect("/")
  },[])
}

export default NotFound
