PGDMP  )                    }            chatbot_non_nlp    17.5    17.5     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16707    chatbot_non_nlp    DATABASE     q   CREATE DATABASE chatbot_non_nlp WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE chatbot_non_nlp;
                     postgres    false            �          0    16783 	   schedules 
   TABLE DATA           |   COPY public.schedules (id, p_id, name, date, time_start, time_end, poli_name, is_leave, created_at, updated_at) FROM stdin;
    public            
   kafinahmad    false    220   B       �           0    0    schedules_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.schedules_id_seq', 27, true);
          public            
   kafinahmad    false    219            �   o  x���[o�H���_я;�r�B� 7&;( EZ�K��n��L�D�߷�m2$��:	����u�N�`E<Hd�N����4�����ӓ�Ŧ�p<N��b(P�.M�g����>o7����;_���e���q��{Q7��zo�z���4�ؙ,�,�D�h]��|(ơ�h�gkdw�D���?�$�L��% XF�+Px�|�8�5Nl�DRòL7(�
m��������@��M$���i�ϞWfW�R�r�&�Iҵ$��dt��L�@-�k������k����g��5�Ĭ��
��@Rj�yّ��熤,����T+'���y�נ�|Y�6e�Q�ʐ@F�5&����yb�VT-�b���O-v2�7���#�w����k���1MN�B/,mG�u**��a��"�_HSPv"��V�u��;�v�D���OW{o��Q3�1� �9Jt�7���Ꙇ;-v��J�Y&-�M*���TJҮ�Ți���w�Dڂ/��`^/�)�?���/��Z�ӄ�i
�Q�	��Ȇ&Aa$����ݑ;%y?"k�ܭJ���2�
ɴA١���5��[��n5��pQ�=�J��^ϭ�r��d-)E�����ЎOS�D�Ц����{Z��Td)���og��aj[�=+!�i��Qa�S	kT�6G�I,2]���C%wnj���G�'�#@�KhU|~��z����X�p�gB�m<�Tcs�2��Sڵ�6���*J�W���R �d��SW�r����`yGoF,}�j=��4�ܗ���o�y�-����~p��l������F8����-��B�\�B�����9�3A�d�3?����I��V��     