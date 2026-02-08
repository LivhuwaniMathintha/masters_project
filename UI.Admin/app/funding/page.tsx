"use client"

import { useState, useEffect, useRef } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { ModeToggle } from "@/components/theme-toggler"

// Funding Condition Schema
const fundingConditionSchema = z.object({
  isFullCoverage: z.boolean(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  totalAmount: z.coerce.number().min(1000, "Total amount must be at least 1000"),
  foodAmount: z.coerce.number().min(0, "Food amount must be at least 0"),
  tuitionAmount: z.coerce.number().min(0, "Tuition amount must be at least 0"),
  laptopAmount: z.coerce.number().min(0, "Laptop amount must be at least 0"),
  accommodationAmount: z.coerce.number().min(0, "Accommodation amount must be at least 0"),
  accommodationDirectPay: z.boolean(),
  averageMark: z.coerce.number().min(65, "Average mark must be at least 65"),
})

// Funding Schema
const fundingSchema = z.object({
  funderId: z.string().min(1, "Funder is required"),
  studentNumber: z.string().min(1, "Student Number is required"),
  foodBalance: z.number(),
  tuitionBalance: z.number(),
  laptopBalance: z.number(),
  accommodationBalance: z.number(),
  dataConfirmedById: z.string().min(1, "Data Confirmed By is required"),
  signedOn: z.string().min(1, "Signed On is required"),
})

type FundingConditionForm = z.infer<typeof fundingConditionSchema>
type FundingForm = z.infer<typeof fundingSchema>

export default function FundingPage() {
  const [step, setStep] = useState(1)
  const [conditionId, setConditionId] = useState<string | null>(null)
  const [backDisabled, setBackDisabled] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const pendingConditionData = useRef<FundingConditionForm | null>(null)
  const [funders, setFunders] = useState<{ id: string; name: string }[]>([])
  const [studentError, setStudentError] = useState<string | null>(null)
  const [studentValid, setStudentValid] = useState<boolean>(true)
  const [studentId, setStudentId] = useState<string | null>(null)
  const [studentName, setStudentName] = useState<string | null>(null)
  const [courseName, setCourseName] = useState<string | null>(null)
  const [studentActive, setStudentActive] = useState<boolean | null>(null)

  // Use z.input<typeof fundingConditionSchema> for input type to match resolver
  const methods1 = useForm<z.input<typeof fundingConditionSchema>>({
    resolver: zodResolver(fundingConditionSchema),
    defaultValues: {
      isFullCoverage: false,
      startDate: "",
      endDate: "",
      totalAmount: 0,
      foodAmount: 0,
      tuitionAmount: 0,
      laptopAmount: 0,
      accommodationAmount: 0,
      accommodationDirectPay: false,
      averageMark: 0,
    },
  })
  const methods2 = useForm<FundingForm>({
    resolver: zodResolver(fundingSchema),
    defaultValues: {
      funderId: "",
      studentNumber: "",
      foodBalance: 0,
      tuitionBalance: 0,
      laptopBalance: 0,
      accommodationBalance: 0,
      dataConfirmedById: "",
      signedOn: "",
    },
  })

  const errors1 = methods1.formState.errors;
  const errors2 = methods2.formState.errors;
  // Step 1: Funding Condition
  const onSubmitCondition = async (data: z.input<typeof fundingConditionSchema>) => {
    // Show confirmation dialog before saving
    const safeData: FundingConditionForm = {
      ...data,
      totalAmount: Number(data.totalAmount),
      foodAmount: Number(data.foodAmount),
      tuitionAmount: Number(data.tuitionAmount),
      laptopAmount: Number(data.laptopAmount),
      accommodationAmount: Number(data.accommodationAmount),
      averageMark: Number(data.averageMark),
    }
    pendingConditionData.current = safeData
    setShowConfirm(true)
  }

  // Actually save after confirmation
  const handleConfirmSave = async () => {
    setShowConfirm(false)
    const safeData = pendingConditionData.current
    if (!safeData) return
    try {
        const fullData = {id: crypto.randomUUID(), updatedAt: new Date().toISOString(), modifiedBy: "admin-user", ...safeData}
      const res = await axios.post("https://localhost:7288/api/fundingconditioncontracts", fullData)
      console.log("response for conditions: ", res.data)
      setConditionId(res.data.data)
      setStep(2)
      setBackDisabled(true)
      toast.success("Funding conditions saved. You cannot go back.")
    } catch (e) {
      toast.error("Failed to save funding condition.")
    }
  }

  // Step 2: Funding
  const onSubmitFunding = async (data: FundingForm) => {
    console.log("Funding submit called", data);
    try {

      if (!conditionId) throw new Error("No condition id")
      
      const payload = { ...data, funderContractConditionId: conditionId, studentId: studentId, modifiedby: studentName}
      await axios.post("https://localhost:7288/api/fundingcontracts", payload)
      toast.success("Funding and conditions saved successfully!")
      setStep(1)
      setConditionId(null)
      methods1.reset()
      methods2.reset()
    } catch (e) {
        console.log(e)
      toast.error("Failed to save funding.")
    }
  }

  useEffect(() => {
    if (step === 2) {
      axios.get("https://localhost:7288/api/fundercontracts")
        .then(res => {
          setFunders(res.data.map((f: any) => ({ id: f.id, name: f.name })))
        })
        .catch(() => setFunders([]))
      // Set balances to previous amounts, cast to number
      const prev = methods1.getValues()
      methods2.reset({
        ...methods2.getValues(),
        foodBalance: Number(prev.foodAmount),
        tuitionBalance: Number(prev.tuitionAmount),
        laptopBalance: Number(prev.laptopAmount),
        accommodationBalance: Number(prev.accommodationAmount),
      })
    }
  }, [step])

  const handleStudentBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const studentNumber = e.target.value.trim()
    if (!studentNumber) return
    try {
      const res = await axios.get(`https://localhost:7288/api/usercontracts/${studentNumber}`)
      setStudentError(null)
      setStudentValid(res.data.isActive)
      setStudentName(res.data.name)
      setCourseName(res.data.courseName)
      setStudentActive(res.data.isActive)
      setStudentId(res.data.id)
      if (!res.data.isActive) {
        setStudentError("Student found but not active. Funding for inactive student cannot be added.")
      }
    } catch {
      setStudentError("Student not found.")
      setStudentValid(false)
      setStudentName(null)
      setCourseName(null)
      setStudentActive(null)
    }
  }

  // Cancel on step 2: update condition and reset
  const handleCancel = async () => {
    if (!conditionId || !pendingConditionData.current) return
    try {
      await axios.put("https://localhost:7288/api/fundingconditioncontracts", {
        id: conditionId,
        isActive: true, // or false if you want to mark as cancelled
        averageMark: pendingConditionData.current.averageMark,
        modifiedBy: "admin-user"
      })
      toast.success("Funding condition cancelled and updated.")
    } catch (e) {
      toast.error("Failed to update/cancel funding condition.")
    }
    setStep(1)
    setConditionId(null)
    setBackDisabled(false)
    methods1.reset()
    methods2.reset()
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Toaster position="top-center"/>
      <div className="flex flex-col items-center">
        <div className="flex items-center items-center justify-between w-full mb-10 border-1 dark:border-white/10 border-gray-800 p-5 rounded-lg">
            <ModeToggle/>
            <h1 className="text-3xl font-extrabold tracking-tight">Funding</h1>
        </div>
        <hr />
        <div className="flex items-center gap-4 mb-10">
          <div className={`flex flex-col items-center`}> 
            <div className={`rounded-full w-8 h-8 flex items-center justify-center text-white text-lg font-bold ${step === 1 ? 'bg-green-500' : 'bg-gray-300'}`}>1</div>
            <span className={`mt-2 text-xs font-semibold ${step === 1 ? 'text-green-600' : 'text-gray-400'}`}>Funding Conditions</span>
          </div>
          <div className="w-10 h-1 bg-gray-300 rounded" />
          <div className={`flex flex-col items-center`}>
            <div className={`rounded-full w-8 h-8 flex items-center justify-center text-white text-lg font-bold ${step === 2 ? 'bg-green-500' : 'bg-gray-300'}`}>2</div>
            <span className={`mt-2 text-xs font-semibold ${step === 2 ? 'text-green-600' : 'text-gray-400'}`}>Funding Info</span>
          </div>
        </div>
      </div>
      {step === 1 && (
        <FormProvider {...methods1}>
          <form onSubmit={methods1.handleSubmit(onSubmitCondition)}>
            <div className="space-y-4">
              <FormField name="isFullCoverage" render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Label>Full Coverage?</Label>
                  <input type="checkbox" {...field} checked={field.value} />
                </div>
              )} />
              {/* Error for isFullCoverage (rare, but for completeness) */}
              {errors1.isFullCoverage && (
                <div className="text-red-500 text-xs mt-1">{errors1.isFullCoverage.message as string}</div>
              )}
              <FormField name="startDate" render={({ field }) => (
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" {...field} />
                </div>
              )} />
              {errors1.startDate && (
                <div className="text-red-500 text-xs mt-1">{errors1.startDate.message as string}</div>
              )}
              <FormField name="endDate" render={({ field }) => (
                <div>
                  <Label>End Date</Label>
                  <Input type="date" {...field} />
                </div>
              )} />
              {errors1.endDate && (
                <div className="text-red-500 text-xs mt-1">{errors1.endDate.message as string}</div>
              )}
              <FormField name="totalAmount" render={({ field }) => (
                <div>
                  <Label>Total Amount</Label>
                  <Input type="number" min="0" step="any" {...field} />
                </div>
              )} />
              {errors1.totalAmount && (
                <div className="text-red-500 text-xs mt-1">{errors1.totalAmount.message as string}</div>
              )}
              <FormField name="foodAmount" render={({ field }) => (
                <div>
                  <Label>Food Amount</Label>
                  <Input type="number" min="0" step="any" {...field} />
                </div>
              )} />
              {errors1.foodAmount && (
                <div className="text-red-500 text-xs mt-1">{errors1.foodAmount.message as string}</div>
              )}
              <FormField name="tuitionAmount" render={({ field }) => (
                <div>
                  <Label>Tuition Amount</Label>
                  <Input type="number" min="0" step="any" {...field} />
                </div>
              )} />
              {errors1.tuitionAmount && (
                <div className="text-red-500 text-xs mt-1">{errors1.tuitionAmount.message as string}</div>
              )}
              <FormField name="laptopAmount" render={({ field }) => (
                <div>
                  <Label>Laptop Amount</Label>
                  <Input type="number" min="0" step="any" {...field} />
                </div>
              )} />
              {errors1.laptopAmount && (
                <div className="text-red-500 text-xs mt-1">{errors1.laptopAmount.message as string}</div>
              )}
              <FormField name="accommodationAmount" render={({ field }) => (
                <div>
                  <Label>Accommodation Amount</Label>
                  <Input type="number" min="0" step="any" {...field} />
                </div>
              )} />
              {errors1.accommodationAmount && (
                <div className="text-red-500 text-xs mt-1">{errors1.accommodationAmount.message as string}</div>
              )}
              <FormField name="accommodationDirectPay" render={({ field }) => (
                <div className="flex items-center gap-2 ">
                  <Label>Accommodation Direct Pay?</Label>
                  <input className="" type="checkbox" {...field} checked={field.value} />
                </div>
              )} />
              {errors1.accommodationDirectPay && (
                <div className="text-red-500 text-xs mt-1">{errors1.accommodationDirectPay.message as string}</div>
              )}
              <FormField name="averageMark" render={({ field }) => (
                <div>
                  <Label>Average Mark</Label>
                  <Input type="number" {...field} />
                </div>
              )} />
              {errors1.averageMark && (
                <div className="text-red-500 text-xs mt-1">{errors1.averageMark.message as string}</div>
              )}
            </div>
            <Button type="submit" className="mt-6 w-full">Next</Button>
          </form>
        </FormProvider>
      )}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="font-bold mb-2">Are you sure?</h2>
            <p className="mb-4 text-sm">You will <span className="font-semibold">not</span> be able to go back and change these values after this step. Continue?</p>
            <div className="flex gap-4 justify-end">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>No</Button>
              <Button onClick={handleConfirmSave}>Yes, Continue</Button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <FormProvider {...methods2}>
          <form onSubmit={methods2.handleSubmit(onSubmitFunding)}>
            <div className="space-y-4">
              <FormField name="funderId" render={({ field }) => (
                <div>
                  <Label>Funder</Label>
                  <select {...field} className="w-full border rounded px-3 py-2">
                    <option value="">Select a funder...</option>
                    {funders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              )} />
              {errors2.funderId && (
                <div className="text-red-500 text-xs mt-1">{errors2.funderId.message as string}</div>
              )}
              <FormField name="studentNumber" render={({ field }) => (
                <div>
                  <Label>Student Number</Label>
                  <Input {...field} onBlur={handleStudentBlur} />
                  {studentError && (
                    <div className={`text-xs mt-1 ${studentActive === false ? 'text-orange-500' : 'text-red-500'}`}>{studentError}</div>
                  )}
                  {studentValid && studentName && studentActive && (
                    <div className="text-green-600 text-xs mt-1">Student found: {studentName} <span className="text-gray-500">({courseName})</span></div>
                  )}
                </div>
              )} />
              {errors2.studentNumber && (
                <div className="text-red-500 text-xs mt-1">{errors2.studentNumber.message as string}</div>
              )}
              <FormField name="foodBalance" render={({ field }) => (
                <div>
                  <Label>Food Balance</Label>
                  <Input type="number" {...field} />
                </div>
              )} />
              {errors2.foodBalance && (
                <div className="text-red-500 text-xs mt-1">{errors2.foodBalance.message as string}</div>
              )}
              <FormField name="tuitionBalance" render={({ field }) => (
                <div>
                  <Label>Tuition Balance</Label>
                  <Input type="number" {...field} />
                </div>
              )} />
              {errors2.tuitionBalance && (
                <div className="text-red-500 text-xs mt-1">{errors2.tuitionBalance.message as string}</div>
              )}
              <FormField name="laptopBalance" render={({ field }) => (
                <div>
                  <Label>Laptop Balance</Label>
                  <Input type="number" {...field} />
                </div>
              )} />
              {errors2.laptopBalance && (
                <div className="text-red-500 text-xs mt-1">{errors2.laptopBalance.message as string}</div>
              )}
              <FormField name="accommodationBalance" render={({ field }) => (
                <div>
                  <Label>Accommodation Balance</Label>
                  <Input type="number" {...field} />
                </div>
              )} />
              {errors2.accommodationBalance && (
                <div className="text-red-500 text-xs mt-1">{errors2.accommodationBalance.message as string}</div>
              )}
              <FormField name="dataConfirmedById" render={({ field }) => (
                <div>
                  <Label>Data Confirmed By (User ID)</Label>
                  <Input {...field} />
                </div>
              )} />
              {errors2.dataConfirmedById && (
                <div className="text-red-500 text-xs mt-1">{errors2.dataConfirmedById.message as string}</div>
              )}
              <FormField name="signedOn" render={({ field }) => (
                <div>
                  <Label>Signed On</Label>
                  <Input type="date" {...field} />
                </div>
              )} />
              {errors2.signedOn && (
                <div className="text-red-500 text-xs mt-1">{errors2.signedOn.message as string}</div>
              )}
            </div>
            <div className="flex flex-row mt-6 justify-between w-full">
              <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button type="submit" className="" disabled={!studentValid}>Submit</Button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  )
}
