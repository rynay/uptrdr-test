import { useFormik } from 'formik';
import classNames from 'classnames';
import { Fragment, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { selectChildIssues, selectIssues } from '../../redux/selectors';
import * as form from '../../data/form';
import { Select } from '../Select/Select';
import { Option } from '../Select/Option';
import { IssueInfo } from '../IssueInfo/IssueInfo';
import '../../styles/common.scss';
import './Form.scss';

export const Form = ({ type, onSubmit, initialState }) => {
  const { projectId, issueId } = useParams();
  const location = useLocation();
  const parentId = location?.state?.from.pathname.split('/').splice(-1)[0];
  const childIssues = useSelector(selectChildIssues(projectId, issueId));
  const existedIssues = useSelector(selectIssues(projectId));

  const fields = useMemo(() => {
    if (parentId) {
      return form.getFields(existedIssues?.map((el) => el.id)?.filter((el) => el === parentId));
    } else {
      let exitedIssueIds = existedIssues?.map((el) => el.id);
      if (childIssues.length)
        exitedIssueIds = exitedIssueIds?.filter((id) => (
          childIssues.every((issue) => issue.id !== id)
        ));
      return form.getFields(exitedIssueIds?.filter(id => id !== issueId));
    }
  }, [existedIssues, parentId, childIssues, issueId]);

  const formik = useFormik({
    initialValues: {
      ...Object.fromEntries(fields[type].map((el) => [el?.name, initialState?.[el?.name] || ''])),
      ...(parentId && { parentIssue: parentId }),
    },
    onSubmit: (values) => {
      onSubmit({
        ...initialState,
        ...Object.fromEntries(Object.entries(values).filter(([_, value]) => value)),
      });
    },
  });

  return (
    <form className="form" onSubmit={formik.handleSubmit}>
      <div className="form__wrapper">
        <h1 className="form__heading">
        {type === 'project' && 'Create new project'}
        {(type === 'issue' && !issueId) ? 'Create new issue' : 'Edit issue'}
        </h1>
        {fields[type].map((field) => (
          field && (
            <Fragment key={field.name}>
              {field.options ? (
                <div
                  className={classNames({
                    form__fullWidth: field.name === 'parentIssue',
                  })}
                >
                  <label id={field.name}>{field.placeholder}</label>
                  <Select
                    onChange={formik.setFieldValue}
                    value={formik.values[field.name]}
                    labelId={field.name}
                    id={field.name}
                    name={field.name}
                    placeholder={
                      field.name === 'parentIssue' ? (
                        formik.values[field.name] && (
                          <IssueInfo issue={existedIssues.find((el) => el.id === formik.values[field.name])} />
                        )
                      ) : (
                        <div className="form__option">{formik.values[field.name]}</div>
                      )
                    }
                  >
                    {field.options.map((option) => {
                      if (field.name !== 'parentIssue') {
                        return (
                          <Option key={option} value={option}>
                            <div className="form__option">{option}</div>
                          </Option>
                        );
                      } else {
                        return (
                          <Option key={option} value={option}>
                            <IssueInfo issue={existedIssues.find((el) => el.id === option)} />
                          </Option>
                        );
                      }
                    })}
                  </Select>
                </div>
              ) : (
                <input
                  {...field}
                  className={classNames('form__input', {
                    'form__input--minified': field.minified,
                  })}
                  key={field.name}
                  id={field.name}
                  label={field.placeholder}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                />
              )}
            </Fragment>
          )
        ))}
      </div>
      <button className="button" type="submit">
        Save
      </button>
    </form>
  );
};
