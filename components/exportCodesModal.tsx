import { Box, Message, Modal, ModalAction, ProgressBar, Stepper, Text } from '@bigcommerce/big-design'
import { useState } from 'react'
import { makeDataUrl } from '@lib/util'
import { useSession } from '../context/session'

interface ExportCodesModalProps {
    promotionId: number,
    onClose: () => void
}

// TODO: ALL OF THIS
const ExportCodesModal = ({ promotionId, onClose }: ExportCodesModalProps) => {
    const encodedContext = useSession()?.context
    const timestamp = Date.now()
    const steps = ["Export Codes", "Download CSV"]
    const [currentStep, setCurrentStep] = useState(0)
    const [coupons, setCoupons] = useState([])
    const [abortController, setAbortController] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [total, setTotal] = useState(0)

    const fetchCoupons = async (signal, page = 1, coupons = [], retries = 0) => {
        if (retries > 2) {
            abortController.abort()
            alert('Error querying BigCommerce. Stopped after 3 retries.') // TODO: Convert to Alert with AlertsManager
            setCurrentStep(1)
        }

        const params = new URLSearchParams({ page: page.toString(), limit: "250", context: encodedContext }).toString()
        // const params = new URLSearchParams({ context: encodedContext, page: page.toString(), limit: "250" }).toString()
        const response = await fetch(`/api/promotions/${promotionId}/codes?${params}`, {
            method: 'GET', 
            signal
        })

        if (response.ok) {
            const { data, meta } = await response.json()
            setCoupons( prevCoupons => prevCoupons.concat(data))

            if (meta?.pagination?.current_page < meta?.pagination?.total_pages) {
                setCurrentPage(meta?.pagination?.current_page)
                setTotal(meta?.pagination?.total)

                return await fetchCoupons(signal, page + 1, coupons.concat(data))
            }

            setCurrentStep(1)

            return
        } else {
            return await fetchCoupons(signal, page, coupons, retries + 1)
        }
    }
 
    if(currentStep === 0 && !abortController) {
        try {
            const ac = new AbortController()
            setAbortController(ac)
            fetchCoupons(ac.signal)
        } catch (error) {
            if (error.message != "The user aborted a request." ) {
                console.error(error)
                setCurrentStep(1)
            }
        }
    }

    const handleClose = () => {
        abortController.abort()
        onClose()
    }

    const handleStop = () => {
        abortController.abort()
        setCurrentStep(1)
    }

    const renderActions = (): ModalAction[] => {
        if (currentStep == 0) {
            return [
                {text: 'Stop Export and Close', variant: 'subtle', onClick: handleClose},
                {text: 'Stop Export and Download Codes', variant: 'primary', onClick: handleStop}
            ]
        }

        if (currentStep == 1) {
            return [
                { text: 'Close', variant: 'subtle', onClick: handleClose}
            ]
        }
    }

    const renderOnModalClose = () => {
        if (currentStep == 0) {
            return handleClose
        }

        if (currentStep == 1) {
            return onClose
        }
    }

    const renderContent = () => {
        switch (currentStep) {
            case 0:
                return <>
                    <Box marginVertical={"large"}>
                    <Text>Retrieved {currentPage * 250} of {total} coupons</Text>
                    <ProgressBar percent={(coupons.length / total) * 100} />
                    <Message type="warning" messages={[{ text: 'Navigating away from this page will stop this process' }]} marginVertical="medium" />
                </Box>
                </>
            case 1:
                return <>
                    <Message 
                        header="Complete"
                        messages={[
                            {
                                text: `Exported ${coupons.length} coupons.`,
                                link: {
                                    text: 'Download coupon codes',
                                    href: makeDataUrl(coupons),
                                    // @ts-ignore
                                    download: `coupon-codes-${timestamp}.csv` 
                                }
                            }  
                        ]}
                    />
                </>
        }
    }

    return (
        <Modal
            isOpen={true}
            actions={renderActions()}
            header="Generate Coupons"
            onClose={renderOnModalClose()}
            closeOnClickOutside={false}
            closeOnEscKey={false}
        >
            <Stepper steps={steps} currentStep={currentStep} />
            { renderContent() }
        </Modal>
    )
}

export default ExportCodesModal