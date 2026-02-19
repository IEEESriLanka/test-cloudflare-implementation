'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Inline Icons to avoid module resolution issues
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-green-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
    </svg>
);

// Validation Schema
const schema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  whatsapp: z.string().min(10, { message: 'Valid WhatsApp number is required' }),
  address: z.string().optional(),
  product: z.string().min(1, { message: 'Product is required' }),
  size: z.string().optional(),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
  deliveryMethod: z.enum(['pickup', 'courier']),
  ieeeMember: z.boolean(),
  ieeeMemberId: z.string().optional(),
  paymentSlip: z
    .any()
    .refine((files) => files?.length > 0, "Payment slip is required")
    .refine((files) => files?.[0]?.size <= 1000000, "File size should be less than 1MB")
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/jpg'].includes(files?.[0]?.type),
      "Only .jpg, .jpeg, and .png formats are allowed"
    ),
}).superRefine((data, ctx) => {
    if (data.deliveryMethod === 'courier') {
        if (!data.address || data.address.trim().length < 5) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Address is required for courier delivery",
                path: ["address"],
            });
        }
    }
});

type FormData = z.infer<typeof schema>;

interface RequestMerchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMerchant: any;
}

const RequestMerchModal: React.FC<RequestMerchModalProps> = ({ isOpen, onClose, selectedMerchant }) => {
  const [successInfo, setSuccessInfo] = useState<{ orderId: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      product: selectedMerchant?.merchantName || '',
      quantity: 1,
      deliveryMethod: 'courier',
      ieeeMember: false,
    }
  });

  // Reset the form when the modal opens
  useEffect(() => {
    if (isOpen && selectedMerchant) {
      reset({
        product: selectedMerchant.merchantName,
        quantity: 1,
        deliveryMethod: 'courier',
        ieeeMember: false,
        fullName: '',
        email: '',
        whatsapp: '',
        address: '',
        size: '',
        ieeeMemberId: '',
      });
      setSuccessInfo(null);
    }
  }, [isOpen, selectedMerchant, reset]);

  const isMember = watch('ieeeMember');
  const deliveryMethod = watch('deliveryMethod');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    try {
        const formData = new FormData();
        
        // Append all fields to FormData
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'paymentSlip' && value?.[0]) {
                formData.append(key, value[0]); // Append the File object
            } else if (value !== undefined) {
                formData.append(key, value.toString());
            }
        });

        const response = await fetch('/api/merch/order', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (result.success) {
            setSuccessInfo({ orderId: result.orderId });
        } else {
            console.error('Order submission failed:', result.error);
            alert('Failed to submit request: ' + (result.error || 'Server error'));
        }
    } catch (err) {
        console.error('Network error during order submission:', err);
        alert('Something went wrong. Please check your connection.');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">
        

        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100/80 backdrop-blur-sm hover:bg-gray-200 text-gray-500 transition-colors z-20"
        >
            <CloseIcon />
        </button>

        <div className="flex-grow overflow-y-auto custom-scrollbar">
            {successInfo ? (
            <div className="p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckIcon />
                </div>
                <h3 className="text-3xl font-bold text-[#002855]">Order Received!</h3>
                <p className="text-gray-500 text-lg">
                    Thank you for your order. Your Order ID is:
                </p>
                <div className="bg-gray-100 py-4 px-8 rounded-xl inline-block text-2xl font-mono font-bold text-[#F37C28] tracking-widest border border-dashed border-gray-300">
                    {successInfo.orderId}
                </div>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    A YPSL coordinator will contact you shortly via WhatsApp or Email regarding payment confirmation and delivery.
                </p>
                <div className="pt-6">
                    <button onClick={onClose} className="bg-[#002855] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#F37C28] transition-colors w-full">
                        Close
                    </button>
                </div>
            </div>
        ) : (
            <div className="p-8 md:p-10 space-y-8">
                {/* Header */}
                <div className="text-center space-y-2 border-b border-gray-100 pb-6">
                    <h3 className="text-2xl font-bold text-[#002855]">Request Merchandise</h3>
                    <p className="text-gray-500 text-sm">Fill in the details below to place your request for <span className="font-bold text-[#F37C28]">{selectedMerchant?.merchantName}</span>.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit, (e) => console.log('Validation Errors:', e))} className="space-y-6">
                    <input type="hidden" {...register('product')} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="col-span-full md:col-span-1 space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <div className="relative">
                                <UserIcon />
                                <input {...register('fullName')} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F37C28] outline-none transition-all" placeholder="John Doe" />
                            </div>
                            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                        </div>

                         {/* WhatsApp */}
                         <div className="col-span-full md:col-span-1 space-y-2">
                            <label className="text-sm font-semibold text-gray-700">WhatsApp Number</label>
                            <div className="relative">
                                <PhoneIcon />
                                <input {...register('whatsapp')} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F37C28] outline-none transition-all" placeholder="+94 77 123 4567" />
                            </div>
                            {errors.whatsapp && <p className="text-red-500 text-xs">{errors.whatsapp.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="col-span-full space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <div className="relative">
                                <MailIcon />
                                <input {...register('email')} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F37C28] outline-none transition-all" placeholder="john@example.com" />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        {/* IEEE Member Toggle */}
                        <div className="col-span-full flex items-center space-x-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                             <input type="checkbox" {...register('ieeeMember')} className="w-5 h-5 text-[#002855] rounded focus:ring-[#002855]" />
                             <label className="text-sm font-medium text-gray-700">I am an IEEE Member</label>
                        </div>

                        {isMember && (
                             <div className="col-span-full space-y-2">
                                <label className="text-sm font-semibold text-gray-700">IEEE Member ID</label>
                                <input {...register('ieeeMemberId')} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F37C28] outline-none" placeholder="Enter Member ID" />
                            </div>
                        )}

                        {/* Size & Quantity */}
                        <div className="col-span-full md:col-span-1 space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Size</label>
                            <select {...register('size')} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F37C28] outline-none appearance-none">
                                <option value="">Select Size</option>
                                {selectedMerchant?.sizes?.map((size: string) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-full md:col-span-1 space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Quantity</label>
                            <input type="number" {...register('quantity', { valueAsNumber: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F37C28] outline-none" min="1" />
                        </div>

                         {/* Payment Slip Upload */}
                         <div className="col-span-full space-y-3 p-6 bg-[#002855]/5 border border-[#002855]/10 rounded-2xl">
                            <div className="flex items-center space-x-3 text-[#002855]">
                                <UploadIcon />
                                <h4 className="font-bold">Payment Proof <span className="text-red-500">*</span></h4>
                            </div>
                            <p className="text-xs text-gray-500">
                                Upload a clear screenshot of your payment slip or transaction receipt. (Max 1MB, PNG/JPG only)
                            </p>
                            <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/jpg"
                                {...register('paymentSlip')}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#002855] file:text-white hover:file:bg-[#F37C28] cursor-pointer" 
                            />
                            {errors.paymentSlip && <p className="text-red-500 text-xs mt-1">{errors.paymentSlip.message as string}</p>}
                        </div>

                        {/* Delivery */}
                        <div className="col-span-full space-y-3">
                            <label className="text-sm font-semibold text-gray-700 block">Delivery Preference</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" value="courier" {...register('deliveryMethod')} className="w-4 h-4 text-[#F37C28] focus:ring-[#F37C28]" />
                                    <span className="text-sm text-gray-600">Courier Delivery</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" value="pickup" {...register('deliveryMethod')} className="w-4 h-4 text-[#F37C28] focus:ring-[#F37C28]" />
                                    <span className="text-sm text-gray-600">Pickup at Event</span>
                                </label>
                            </div>
                        </div>

                         <div className="col-span-full space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Delivery Address {deliveryMethod === 'courier' && <span className='text-red-500'>*</span>}
                            </label>
                            <textarea {...register('address')} rows={2} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F37C28] outline-none resize-none" placeholder="Enter full address for delivery..." />
                             {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                        </div>
                    </div>
                
                    {Object.keys(errors).length > 0 && (
                         <div className="bg-red-50 p-4 rounded-xl border border-red-100 italic">
                             <p className="text-red-600 text-xs">Please fix the highlighted errors before submitting.</p>
                         </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-[#002855] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#F37C28] transition-all shadow-lg active:scale-95 disabled:bg-gray-300 flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Submit Request'}
                    </button>
                </form>
            </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default RequestMerchModal;
