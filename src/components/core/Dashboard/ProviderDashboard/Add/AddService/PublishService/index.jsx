import React from 'react'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { editServiceDetails } from "../../../../../../../services/operations/serviceDetailsAPI"
import { resetServiceState, setStep } from "../../../../../../../slices/serviceSlice"
import { STATUS } from "../../../../../../../utils/constants"
import IconBtn from "../../../../../../Common/IconBtn"


export default function PublishService() {

  const { register, handleSubmit, setValue, getValues } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth);
  const { service } = useSelector((state) => state.service)
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    if (service?.status === STATUS.PUBLISHED) {
      setValue("public", true)
    }
  }, [])

  const goBack = () => {
    dispatch(setStep(2))
  }

  const goToServices = () => {
    dispatch(resetServiceState())
    navigate("/dashboard/my-services")
  }

  const handleServicePublish = async () => {

    console.log("Current Token:", token);
    // check if form has been updated or not
    if (
      (service?.status === STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (service?.status === STATUS.DRAFT && getValues("public") === false)
    ) {
      // form has not been updated
      // no need to make api call
      goToServices()
      return
    }
    const formData = new FormData()
    formData.append("serviceId", service._id)
    const serviceStatus = getValues("public")
      ? STATUS.PUBLISHED
      : STATUS.DRAFT
    formData.append("status", serviceStatus)
    setLoading(true)
    const result = await editServiceDetails(formData, token)
    console.log(result)
    if (result) {
      goToServices()
    }
    setLoading(false)
  }

  const onSubmit = (data) => {
    // console.log(data)
    handleServicePublish()
  }

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Publish Settings
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox */}
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this Service as public
            </span>
          </label>
        </div>

        {/* Next Prev Button */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Back
          </button>
          <IconBtn disabled={loading} text="Save Changes" />
        </div>
      </form>
    </div>
  )
}
