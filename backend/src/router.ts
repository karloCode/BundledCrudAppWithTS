import express, { Router, Request, Response } from 'express';
import Person from './models';

const router = Router();

router.get('/', async(req: Request, res: Response) => {
   try {
      const getPersons: object[] = await Person.find({});
      res.status(200).json(getPersons);
   } catch (error) {
      res.status(400).json({ error: error.message })
   }
});

router.get('/getPerson/:id', async(req: Request, res: Response) => {
   let errors: string[] = [];
   Person.find({ _id: req.params.id}, (err, doc) => {
      if(err){
         errors.push('Cannot find and query the requested id, its either null or already deleted');
         res.status(404).json({ error: err, errors })
      }
      else {
         res.status(200).json(doc)
      }
   });
});

router.post('/addPerson', async(req: Request, res: Response) => {
   let errors: string[] = [];
   try {
      const requestBody: { name: string, age: number, gender: string } = req.body;
      const { name, age, gender } = requestBody;
      
      if(!requestBody) errors.push('Request Body is empty');
      let bodyProps: (string | number)[] = [];
      let propName: string[] = ['name', 'age', 'gender']
      bodyProps.push(name, age, gender);
         
         for(let props = 0; props < bodyProps.length; props++) {
            if(!bodyProps[props]) {
               errors.push(`'${propName[props]}' is undefined, Please complete the form`);
            }
         }
         if(errors.length) throw new Error('Error in Validation');
         else {
            const addPerson = new Person({ name, age, gender });
            const newPerson: object = await addPerson.save();
            res.status(200).json({ newPerson, ok: true })
         }
      
   } catch (error) {
      res.status(400).json({ error: error.message, errors });
   }
});

router.put('/updatePerson/:id', async(req: Request, res: Response) => {
   try {
      const bodyKeys: string[] = Object.keys(req.body);
      console.log(bodyKeys)
      if(bodyKeys.length) {
         let tempBodyStore: object = {}
         const newlyUpdatedProps: object[] = bodyKeys.map(key => {
            if(req.body[key]) {
               tempBodyStore = Object.assign(tempBodyStore, { [key]: req.body[key] })
            } else ''

            return tempBodyStore
         });

         const newBody: object = newlyUpdatedProps[newlyUpdatedProps.length -1];
         await Person.findByIdAndUpdate({ _id: req.params.id}, { $set: newBody });

         const newlyUpdatedPerson: object = await Person.find({ _id: req.params.id});
         res.status(200).json({newlyUpdatedPerson});

      } else {
         const newlyUpdatedPerson: object = await Person.find({ _id: req.params.id})
         res.status(200).json(newlyUpdatedPerson)
      }
   } catch (error) {
      res.status(400).json({ error: error.message, body: req.body })
   }
});

router.delete('/deletePerson/:id', async(req: Request, res: Response) => {
   try {
      const checkPersonId: object = await  Person.find({ _id: req.params.id });
      if(checkPersonId) {
         const deletedPerson: object | null = await Person.findByIdAndDelete({ _id: req.params.id });
         res.status(200).json({ deletedPerson, deleted: true });
      } else {
         throw new Error('Cannot find and query the requested id, its either null or already deleted')
      }
   } catch (error) {
      res.status(404).json({ error: error.message})
   }
})

export = router;