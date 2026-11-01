import { Step, StepButton, StepLabel, Stepper } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
    const activeStep = payment ? 2 : confirmOrder ? 1 : shipping ? 0 : -1
    const steps = [
        { label: 'Shipping', path: '/shipping' },
        { label: 'Confirm Order', path: '/confirm' },
        { label: 'Payment', path: '/payment' },
    ]

    return (
        <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ maxWidth: 720, mx: 'auto', px: 2, py: { xs: 3, sm: 5 } }}
        >
            {steps.map((step, index) => (
                <Step key={step.label} completed={index < activeStep}>
                    <StepButton
                        component={RouterLink}
                        to={step.path}
                        disabled={index > activeStep}
                    >
                        <StepLabel>{step.label}</StepLabel>
                    </StepButton>
                </Step>
            ))}
        </Stepper>
    )
}

export default CheckoutSteps