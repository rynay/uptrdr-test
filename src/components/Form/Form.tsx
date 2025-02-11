import { useFormik } from 'formik';
import classNames from 'classnames';
import { FC, Fragment, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { selectChildIssues, selectIssues } from '../../redux/selectors';
import * as form from '../../data/form';
import { Select } from '../Select/Select';
import { Option } from '../Select/Option';
import { IssueInfo } from '../IssueInfo/IssueInfo';
import styles from './Form.module.scss';
import { Issue } from '../../types';
import { FileUploader } from '../FileUploader/FileUploader';
import localforage from 'localforage';

type Props = {
  type: keyof ReturnType<(typeof form)['getFields']>;
  initialState?: Partial<Issue>;
  onSubmit: (values: Issue) => void;
};

export const Form: FC<Props> = ({ type, onSubmit, initialState }) => {
  const { projectId, issueId } = useParams();
  const location = useLocation();
  const parentId = location?.state?.from.pathname.split('/').splice(-1)[0];
  const childIssues = useSelector(selectChildIssues(projectId!, issueId!));
  const existedIssues = useSelector(selectIssues(projectId!));

  const fields = useMemo(() => {
    if (parentId) {
      return form.getFields(existedIssues?.map((el) => el.id)?.filter((el) => el === parentId));
    } else {
      let exitedIssueIds = existedIssues?.map((el) => el.id);
      if (childIssues.length)
        exitedIssueIds = exitedIssueIds?.filter((id) => childIssues.every((issue) => issue.id !== id));
      return form.getFields(exitedIssueIds?.filter((id) => id !== issueId));
    }
  }, [existedIssues, parentId, childIssues, issueId]);

  const formik = useFormik({
    initialValues: {
      ...Object.fromEntries(
        fields[type].map((el) => [
          el?.name,
          initialState?.[(el?.name as keyof typeof initialState) || ''] || '']
        )
      ),
      ...(parentId && { parentIssue: parentId }),
    },
    onSubmit: (values) => {
      values.files?.forEach(async (file: File) => {
        await localforage.setItem(file.name, file);
      })

      onSubmit({
        ...(initialState || {}),
        ...Object.fromEntries(Object.entries(values).filter(([_, value]) => value)),
        fileIds: values.files?.map((el: File) => el.name),
      } as Issue);
    },
  });

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit}>
      <div className={styles.form__wrapper}>
        <h1 className={styles.form__heading}>
          {type === 'project' && 'Create new project'}
          {type !== 'project' && (type === 'issue' && !issueId ? 'Create new issue' : 'Edit issue')}
        </h1>
        {fields[type].map(
          (field) =>
            field && (
              <Fragment key={field.name}>
                {'options' in field ? (
                  <div
                    className={classNames({
                      [styles.form__fullWidth]: field.name === 'parentIssue',
                    })}
                  >
                    <label id={field.name}>{field.placeholder}</label>
                    <Select
                      onChange={formik.setFieldValue}
                      value={formik.values[field.name]}
                      name={field.name}
                      placeholder={
                        field.name === 'parentIssue' ? (
                          formik.values[field.name] && (
                            <IssueInfo issue={existedIssues.find((el) => el.id === formik.values[field.name])!} />
                          )
                        ) : (
                          <div className="form__option">{formik.values[field.name]}</div>
                        )
                      }
                    >
                      {field.options?.map((option) => {
                        if (field.name !== 'parentIssue') {
                          return (
                            <Option key={option} value={option}>
                              <div className={styles.form__option}>{option}</div>
                            </Option>
                          );
                        } else {
                          return (
                            <Option key={option} value={option}>
                              <IssueInfo issue={existedIssues.find((el) => el.id === option)!} />
                            </Option>
                          );
                        }
                      })}
                    </Select>
                  </div>
                ) : (
                  field.name === 'files' ? (
                    !Boolean(issueId?.toString()) && <div className="container" style={{ gridColumn: '1 / -1' }} >
                      <FileUploader
                        label={field.name}
                        files={formik.values[field.name]}
                        accept=".jpg,.png,.jpeg"
                        updateFiles={(files: File[]) => formik.setFieldValue(field.name, files)}
                      />
                    </div>
                  ) : (
                    <input
                      {...field}
                      className={classNames(styles.form__input, {
                        [styles.form__input_minified]: 'minified' in field && field.minified,
                      })}
                      key={field.name}
                      id={field.name}
                      value={formik.values[field.name]}
                      onChange={formik.handleChange}
                    />
                  )
                )}
              </Fragment>
            )
        )}
      </div>
      <button className="button" type="submit">
        Save
      </button>
    </form>
  );
};
