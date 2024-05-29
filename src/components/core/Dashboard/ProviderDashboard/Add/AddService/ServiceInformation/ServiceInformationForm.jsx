import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  addServiceDetails,
  editServiceDetails,
  
} from "../../../../../../../services/operations/serviceDetailsAPI"

import{
  fetchAllCategories
} from "../../../../../services/operations/categoryDetailsAPI"

import { setService, setStep } from "../../../../../../../slices/serviceSlice"
import { STATUS } from "../../../../../../../utils/constants"
import IconBtn from "../../../../../../Common/IconBtn"
 import Upload from "../Upload"
import ChipInput from "./ChipInput"

//import RequirementsField from "./RequirementsField"

 
export default  function ServiceInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { service, editService } = useSelector((state) => state.service)
  const [loading, setLoading] = useState(false)
  const [serviceCategories, setServiceCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchAllCategories()
      if (categories.length > 0) {
        // console.log("categories", categories)
        setServiceCategories(categories)
      }
      setLoading(false)
    }
    // if form is in edit mode
    if (editService) {
      // console.log("data populated", editCourse)
      setValue("serviceTitle", service.serviceName)
      setValue("serviceShortDesc", service.serviceDescription)
      setValue("servicePrice", service.price)
      setValue("serviceTags", service.tag)
      setValue("serviceLocation,",service.location)
     // setValue("serviceBenefits", course.whatYouWillLearn)
      setValue("serviceCategory", service.category)
      //setValue("serviceRequirements", course.instructions)
      setValue("serviceImage", service.thumbnail)
    }
    getCategories()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.serviceTitle !== service.serviceName||
      currentValues.serviceShortDesc !== service.serviceDescription ||
      currentValues.servicePrice !== service.price ||
      currentValues.serviceTags.toString() !== service.tag.toString() ||
      currentValues.serviceLocation !==service.serviceLocation ||  
      currentValues.serviceCategory._id !== service.category._id ||
      // currentValues.courseRequirements.toString() !==
      //   course.instructions.toString() ||
      //   currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.serviceImage !== service.thumbnail
    ) {
      return true
    }
    return false
  }

  //   handle next button click
  const onSubmit = async (data) => {
    // console.log(data)

    if (editService) {
      // const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      // console.log("now course:", course)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        // console.log(data)
        formData.append("serviceId", service._id)
        if (currentValues.serviceTitle !== service.serviceName) {
          formData.append("serviceName", data.serviceTitle)
        }
        if (currentValues.serviceShortDesc !== service.serviceDescription) {
          formData.append("serviceDescription", data.serviceShortDesc)
        }
        if (currentValues.servicePrice !== service.price) {
          formData.append("price", data.servicePrice)
        }
        if (currentValues.serviceTags.toString() !== service.tag.toString()) {
          formData.append("tag", JSON.stringify(data.serviceTags))
        }
        // if (currentValues.courseBenefits !== service.whatYouWillLearn) {
        //   formData.append("whatYouWillLearn", data.courseBenefits)
        // }
        if (currentValues.serviceCategory._id !== service.category._id) {
          formData.append("category", data.serviceCategory)
        }
        // if (
        //   currentValues.courseRequirements.toString() !==
        //   service.instructions.toString()
        // ) {
        //   formData.append(
        //     "instructions",
        //     JSON.stringify(data.courseRequirements)
        //   )
        // }
        if (currentValues.serviceImage !== service.thumbnail) {
          formData.append("thumbnailImage", data.serviceImage)
        }
        // console.log("Edit Form data: ", formData)
        setLoading(true)
        const result = await editServiceDetails(formData, token)
        setLoading(false)
        if (result) {
          dispatch(setStep(2))
          dispatch(setService(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      return
    }

    const formData = new FormData()
    formData.append("serviceName", data.serviceTitle)
    formData.append("serviceDescription", data.serviceShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", JSON.stringify(data.serviceTags))
    //formData.append("whatYouWillLearn", data.serviceBenefits)
    formData.append("category", data.serviceCategory)
    formData.append("status", STATUS.DRAFT)
    //formData.append("instructions", JSON.stringify(data.serviceRequirements))
    formData.append("thumbnailImage", data.serviceImage)
    setLoading(true)
    const result = await addServiceDetails(formData, token)
    if (result) {
      dispatch(setStep(2))
      dispatch(setService(result))
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="serviceTitle">
          Service Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="serviceTitle"
          placeholder="Enter Service Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.serviceTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Service title is required
          </span>
        )}
      </div>
      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="serviceShortDesc">
          Service Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="serviceShortDesc"
          placeholder="Enter Description"
          {...register("serviceShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.serviceShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Service Description is required
          </span>
        )}
      </div>
      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="servicePrice">
          Service Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="servicePrice"
            placeholder="Enter Course Price"
            {...register("servicePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Service Price is required
          </span>
        )}
      </div>
        {/* service Location */}
        <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="serviceLocation">
        Service Location<sup className="text-pink-200">*</sup>
        </label>
        <input
          id="serviceLocation"
          placeholder="Enter Service Location"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.serviceLocation && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Service Location is required
          </span>
        )}
      </div>
      {/* service Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="serviceCategory">
          Service Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("serviceCategory", { required: true })}
          defaultValue=""
          id="serviceCategory"
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            serviceCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.serviceCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Service Category is required
          </span>
        )}
      </div>
      {/* service Tags */}
      <ChipInput
        label="Tags"
        name="serviceTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
      {/* service Thumbnail Image */}
      <Upload
        name="serviceImage"
        label="Service Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editService ? service?.thumbnail : null}
      />
      {/* Benefits of the service
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="serviceBenefits">
          Benefits of the service <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="serviceBenefits"
          placeholder="Enter benefits of the service"
          {...register("serviceBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.serviceBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the service is required
          </span>
        )}
      </div>
      {/* Requirements/Instructions }
      <RequirementsField
        name="serviceRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      /> */}
      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editService && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editService ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}


