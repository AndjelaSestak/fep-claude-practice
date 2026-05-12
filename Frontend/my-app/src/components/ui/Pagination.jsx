import Button from './Button'

export const Pagination = ({ page, onPrev, onNext, disablePrev, disableNext }) => {
  return (
    <div className="flex justify-center items-center gap-4 pt-4">
      <Button variant="outline" onClick={onPrev} disabled={disablePrev}>
        Previous
      </Button>
      <span className="text-sm font-medium">Page {page}</span>
      <Button variant="outline" onClick={onNext} disabled={disableNext}>
        Next
      </Button>
    </div>
  )
}
