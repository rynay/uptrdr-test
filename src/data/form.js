import * as Yup from 'yup';

export const schemas = {
  project: Yup.object().shape({
    title: Yup.string().max(100, 'Too Long!').required('Title is Required'),
  }),
  issue: Yup.object().shape({
    title: Yup.string().max(100, 'Too Long!').required('Title is Required'),
    description: Yup.string().max(300, 'Too Long!'),
    points: Yup.number().positive('Positive').integer('Integer').max(10, '0 - 10').typeError('Number'),
  }),
};

export const getFields = (parentIssues = []) => ({
  project: [{ name: 'title', placeholder: 'Title *' }],
  issue: [
    { name: 'title', placeholder: 'Title *', required: true },
    {
      name: 'priority',
      placeholder: 'Priority',
      options: ['Critical', 'Major', 'Normal', 'Minor'],
      minified: 'minified',
    },
    {
      name: 'points',
      placeholder: 'Story Points *',
      type: 'number',
      min: '1',
      max: '99',
      minified: 'minified',
      required: true,
    },
    {
      name: 'status',
      placeholder: 'Status',
      minified: 'minified',
      options: ['Queue', 'Development', 'Done'],
    },
    parentIssues.length ? {
      name: 'parentIssue',
      placeholder: 'Parent Issue',
      options: parentIssues,
    } : null,
    {
      name: 'description',
      placeholder: 'Description *',
      multiline: true,
      required: true,
    },
  ],
});
