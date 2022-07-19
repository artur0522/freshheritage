import { useState, useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import moment from 'moment'
import { PortableText } from '@portabletext/react'
import classes from './ArticleContestForm.module.scss'
import Image from 'next/image'
import ResponsiveImage from '@/components/ResponsiveImage'
import IconUpload from '@/svgs/upload.svg'

const ArticleContestForm = ({fields}) => {

  fields = {
    title: fields.title,
    ...fields.fields
  }

  const { contestForm } = fields
  const [mounted, setMounted] = useState(false)
  const [checkboxChecked, setCheckboxCheck] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 1074px)'}
  )

  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const emailRef = useRef()
  const phoneRef = useRef()
  const recipeRef = useRef()
  const recipeInfoRef = useRef()

  const endDateTextFormatted = moment(fields.formEndDate).format('MMMM DD, h:mm a')

  const unixNowDate = moment().unix()
  const unixEndDate = moment(fields.formEndDate).unix()

  const onSubmit = (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={classes['contest-form']}>
      <div className={classes['contest-form__header']}>
        <h1>{fields.title}</h1>
        <h2>{fields.subheader}</h2>
      </div>
      <div className={classes['contest-form__form']}>
        <div className={classes['contest-form__hero']}>
          {contestForm?.heroImage && isMobile && mounted &&
            <ResponsiveImage
              src={contestForm?.heroImage.asset.url}
              alt={contestForm?.heroImage.asset.alt || ''}
            />}
          {contestForm?.heroImage && isDesktop && mounted &&
            <Image
              src={contestForm?.heroImage.asset.url}
              layout="fill"
              alt={contestForm?.heroImage.asset.alt || ''}
            />
          }
        </div>

        {unixNowDate > unixEndDate ? (
          <div className={classes['contest-form__panel']}>
            <h4>Submission deadline has passed. Thank you for participating!</h4>
          </div>
        ):(
          <div className={classes['contest-form__panel']}>
            <h4>Submissions Close <span>{endDateTextFormatted}</span></h4>
            <div className={classes['contest-form__description']}>
              <PortableText value={fields.contestForm.content} />
            </div>
            <form onSubmit={(e) => onSubmit(e)}>
              <div className="input-group--wrapper">
                <div className="input-group">
                  <label className="label label--block secondary--body">First Name</label>
                  <input className="input" type="text" placeholder="First Name" ref={firstNameRef} required />
                </div>
                <div className="input-group">
                  <label className="label label--block secondary--body">Last Name</label>
                  <input className="input" type="text" placeholder="Last Name" ref={lastNameRef} required />
                </div>
              </div>
              <div className="input-group--wrapper">
                <div className="input-group">
                  <label className="label label--block secondary--body">Email Address</label>
                  <input className="input" type="email" placeholder="Email Address" ref={emailRef} required />
                </div>
                <div className="input-group">
                  <label className="label label--block secondary--body">Phone Number</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Phone Number"
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    ref={phoneRef}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="label label--block secondary--body">Recipe Name</label>
                <input className="input" type="text" placeholder="Recipe Name" ref={recipeRef} required />
              </div>

              <div className="input-group">
                <label className="label label--block secondary--body">Your Recipe</label>
                <textarea className="textarea" type="text" placeholder="Include your recipe, ingredients and steps." ref={recipeInfoRef} required />
              </div>

              <div className={`${classes['contest-form__upload']} ${classes['contest-form__btn-item']}`}>
                <button onClick={(e) => e.preventDefault()} className="btn sitkablue">
                  <IconUpload />
                  <span>Upload Photo or Video</span>
                </button>
              </div>

              <div className={`${classes['contest-form__submit']} ${classes['contest-form__btn-item']}`}>
                <button className="btn salmon" disabled={!checkboxChecked}>Submit Your Entry</button>
                <div className="input-group input-group--checkbox">
                  <input className="input" type="checkbox" onChange={() => setCheckboxCheck(!checkboxChecked)} />
                  <label>I have read and understood te terms & conditions.</label>
                </div>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  )
}

export default ArticleContestForm